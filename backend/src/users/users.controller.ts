import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseGuards(AuthGuard('jwt'))
	@Get('me')
	async me(@Req() req: any) {
		const user = await this.usersService.findById(req.user.userId);
		if (!user) return null;
		return { id: user.id, name: user.name, email: user.email };
	}
}
