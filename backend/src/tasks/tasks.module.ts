import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController, SingleTaskController } from './tasks.controller';
import { Task } from './task.entity';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [TypeOrmModule.forFeature([Task]), ProjectsModule, UsersModule],
	providers: [TasksService],
	controllers: [TasksController, SingleTaskController],
	exports: [TasksService, TypeOrmModule],
})
export class TasksModule {}
