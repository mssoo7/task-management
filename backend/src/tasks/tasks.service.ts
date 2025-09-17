import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './task.entity';
import { ProjectsService } from '../projects/projects.service';
import { UsersService } from '../users/users.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class TasksService {
	constructor(
		@InjectRepository(Task)
		private readonly tasksRepo: Repository<Task>,
		private readonly projectsService: ProjectsService,
		private readonly usersService: UsersService,
		private readonly realtime: RealtimeGateway,
	) {}

	async create(projectId: string, payload: Partial<Task>) {
		const project = await this.projectsService.findById(projectId);
		const task = this.tasksRepo.create({
			...payload,
			project,
		});
		const saved = await this.tasksRepo.save(task);
		this.realtime.emitTaskCreated(saved);
		return saved;
	}

	async update(id: string, payload: Partial<Task>) {
		const task = await this.findById(id);
		Object.assign(task, payload);
		const saved = await this.tasksRepo.save(task);
		this.realtime.emitTaskUpdated(saved);
		return saved;
	}

	async assign(id: string, userId: string | null) {
		const task = await this.findById(id);
		if (userId) {
			const user = await this.usersService.findById(userId);
			if (!user) throw new NotFoundException('User not found');
			task.assignee = user;
		} else {
			task.assignee = null;
		}
		const saved = await this.tasksRepo.save(task);
		this.realtime.emitTaskUpdated(saved);
		return saved;
	}

	async remove(id: string) {
		await this.tasksRepo.delete(id);
		this.realtime.emitTaskDeleted(id);
		return { deleted: true };
	}

	async findById(id: string) {
		const task = await this.tasksRepo.findOne({ where: { id } });
		if (!task) throw new NotFoundException('Task not found');
		return task;
	}

	async filter(projectId: string, status?: TaskStatus, assigneeId?: string) {
		const qb = this.tasksRepo
			.createQueryBuilder('task')
			.leftJoinAndSelect('task.assignee', 'assignee')
			.leftJoinAndSelect('task.project', 'project')
			.where('project.id = :projectId', { projectId });
		if (status) qb.andWhere('task.status = :status', { status });
		if (assigneeId) qb.andWhere('assignee.id = :assigneeId', { assigneeId });
		return qb.getMany();
	}
}
