import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { AuthGuard } from '@nestjs/passport';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

class CreateProjectDto {
	@IsNotEmpty()
	name: string;

	@IsOptional()
	@IsString()
	description?: string;
}

class UpdateProjectDto {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsString()
	description?: string;
}

class AddMemberDto {
	@IsNotEmpty()
	userId: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('projects')
export class ProjectsController {
	constructor(private readonly projectsService: ProjectsService) {}

	@Post()
	create(@Req() req: any, @Body() dto: CreateProjectDto) {
		return this.projectsService.create(dto.name, dto.description, req.user.userId);
	}

	@Get()
	findAll() {
		return this.projectsService.findAll();
	}

	@Get(':id')
	findById(@Param('id') id: string) {
		return this.projectsService.findById(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
		return this.projectsService.update(id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.projectsService.remove(id);
	}

	@Post(':id/members')
	addMember(@Param('id') id: string, @Body() dto: AddMemberDto) {
		return this.projectsService.addMember(id, dto.userId);
	}
}
