import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	passwordHash: string;

	@Column()
	name: string;

	@ManyToMany(() => Project, (project) => project.members)
	projects: Project[];

	@OneToMany(() => Project, (project) => project.owner)
	ownedProjects: Project[];

	@OneToMany(() => Task, (task) => task.assignee)
	assignedTasks: Task[];
} 