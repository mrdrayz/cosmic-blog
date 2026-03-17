import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(userDto: { email: string; password: string; name: string }) {
        const existingUser = await this.findOne(userDto.email);
        if (existingUser) {
            throw new ConflictException('Этот email уже зарегистрирован');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userDto.password, salt);
        const user = this.usersRepository.create({
            ...userDto,
            password: hashedPassword,
        });
        return this.usersRepository.save(user);
    }

    async findOne(email: string): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { email }, select: ['id', 'email', 'name', 'password']});
    }

    async findById(id: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id }, select: ['id', 'email', 'name', 'password'] });
    }

    async update(id: number, updateUserDto: any) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        await this.usersRepository.update(id, updateUserDto);
        return this.findById(id);
    }

    async remove(id: number) {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundException('Пользователь не найден');
        }

        await this.usersRepository.delete(id);
        return { deleted: true };
    }

    async getCurrentUser(userId: number): Promise<User | undefined> {
        return this.usersRepository.findOne({ where: { id: userId }, select: ['id', 'email', 'name'] });
    }
}