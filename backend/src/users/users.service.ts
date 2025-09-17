import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async createUser(name: string, email: string, password: string): Promise<User> {
		const existing = await this.usersRepository.findOne({ where: { email } });
		if (existing) {
			throw new Error('Email already registered');
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const user = this.usersRepository.create({ name, email, passwordHash });
		return this.usersRepository.save(user);
	}

	async findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { email } });
	}

	async findById(id: string): Promise<User | null> {
		return this.usersRepository.findOne({ where: { id } });
	}
}
