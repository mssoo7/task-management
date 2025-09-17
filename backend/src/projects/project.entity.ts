import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Task } from '../tasks/task.entity';

@Entity()
export class Project {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	name: string;

	@Column({ nullable: true })
	description?: string;

	@ManyToOne(() => User, (user) => user.ownedProjects, { eager: true })
	owner: User;

	@ManyToMany(() => User, (user) => user.projects, { eager: true })
	@JoinTable()
	members: User[];

	@OneToMany(() => Task, (task) => task.project, { cascade: true })
	tasks: Task[];
} 