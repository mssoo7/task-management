import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '@nestjs/passport';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from './task.entity';

class CreateTaskDto {
	@IsNotEmpty()
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;

	@IsOptional()
	assigneeId?: string;

	@IsOptional()
	@IsDateString()
	dueDate?: string;
}

class UpdateTaskDto {
	@IsOptional()
	@IsString()
	title?: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsEnum(TaskStatus)
	status?: TaskStatus;

	@IsOptional()
	assigneeId?: string | null;

	@IsOptional()
	@IsDateString()
	dueDate?: string | null;
}

@UseGuards(AuthGuard('jwt'))
@Controller('projects/:projectId/tasks')
export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	@Post()
	create(@Param('projectId') projectId: string, @Body() dto: CreateTaskDto) {
		const payload: any = {
			title: dto.title,
			description: dto.description,
			status: dto.status,
			dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
		};
		return this.tasksService.create(projectId, payload);
	}

	@Get()
	filter(
		@Param('projectId') projectId: string,
		@Query('status') status?: TaskStatus,
		@Query('assigneeId') assigneeId?: string,
	) {
		return this.tasksService.filter(projectId, status, assigneeId);
	}
}

@UseGuards(AuthGuard('jwt'))
@Controller('tasks')
export class SingleTaskController {
	constructor(private readonly tasksService: TasksService) {}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
		const payload: any = {
			title: dto.title,
			description: dto.description,
			status: dto.status,
			dueDate: dto.dueDate === null ? null : dto.dueDate ? new Date(dto.dueDate) : undefined,
		};
		return this.tasksService.update(id, payload);
	}

	@Post(':id/assign')
	assign(@Param('id') id: string, @Body('assigneeId') assigneeId?: string | null) {
		return this.tasksService.assign(id, assigneeId ?? null);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.tasksService.remove(id);
	}
}
