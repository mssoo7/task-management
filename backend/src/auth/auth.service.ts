import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async register(name: string, email: string, password: string) {
		const user = await this.usersService.createUser(name, email, password);
		const accessToken = await this.signToken(user.id, user.email);
		return { user: { id: user.id, name: user.name, email: user.email }, accessToken };
	}

	async login(email: string, password: string) {
		const user = await this.usersService.findByEmail(email);
		if (!user) throw new UnauthorizedException('Invalid credentials');
		const valid = await bcrypt.compare(password, user.passwordHash);
		if (!valid) throw new UnauthorizedException('Invalid credentials');
		const accessToken = await this.signToken(user.id, user.email);
		return { user: { id: user.id, name: user.name, email: user.email }, accessToken };
	}

	private async signToken(userId: string, email: string): Promise<string> {
		return this.jwtService.signAsync({ sub: userId, email });
	}
}
