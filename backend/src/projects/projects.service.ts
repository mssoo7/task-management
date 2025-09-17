import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class ProjectsService {
	constructor(
		@InjectRepository(Project)
		private readonly projectsRepo: Repository<Project>,
		private readonly usersService: UsersService,
	) {}

	create(name: string, description: string | undefined, ownerId: string) {
		return this.withOwner(ownerId, async (owner) => {
			const project = this.projectsRepo.create({ name, description, owner, members: [owner] });
			return this.projectsRepo.save(project);
		});
	}

	async findAll(): Promise<Project[]> {
		return this.projectsRepo.find();
	}

	async findById(id: string): Promise<Project> {
		const project = await this.projectsRepo.findOne({ where: { id } });
		if (!project) throw new NotFoundException('Project not found');
		return project;
	}

	async update(id: string, data: Partial<Project>): Promise<Project> {
		const project = await this.findById(id);
		Object.assign(project, data);
		return this.projectsRepo.save(project);
	}

	async remove(id: string) {
		await this.projectsRepo.delete(id);
		return { deleted: true };
	}

	async addMember(projectId: string, userId: string) {
		const project = await this.findById(projectId);
		const user = await this.usersService.findById(userId);
		if (!user) throw new NotFoundException('User not found');
		project.members = Array.from(new Set([...(project.members || []), user]));
		return this.projectsRepo.save(project);
	}

	private async withOwner<T>(ownerId: string, fn: (owner: any) => Promise<T>) {
		const owner = await this.usersService.findById(ownerId);
		if (!owner) throw new NotFoundException('Owner not found');
		return fn(owner);
	}
}
