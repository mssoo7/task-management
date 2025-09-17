import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Project } from '../projects/project.entity';

export enum TaskStatus {
	TODO = 'todo',
	IN_PROGRESS = 'in-progress',
	DONE = 'done',
}

@Entity()
export class Task {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	title: string;

	@Column({ type: 'text', nullable: true })
	description?: string;

	@Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
	status: TaskStatus;

	@ManyToOne(() => User, (user) => user.assignedTasks, { eager: true, nullable: true })
	assignee?: User | null;

	@ManyToOne(() => Project, (project) => project.tasks, { eager: true, onDelete: 'CASCADE' })
	project: Project;

	@Column({ type: 'timestamp', nullable: true })
	dueDate?: Date | null;
} 