import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ArticlesService {
    constructor(
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    async create(articleDto: { title: string; content: string; previewImage: string; authorId: number }) {
        const user = await this.usersRepository.findOne({ where: { id: articleDto.authorId } });

        if (!user) {
            throw new Error('Invalid user.');
        }

        const article = this.articlesRepository.create({
            title: articleDto.title,
            content: articleDto.content,
            previewImage: articleDto.previewImage,
            author: user,
        });

        return this.articlesRepository.save(article);
    }

    async findAll(page: number, limit: number) {
        const [result, total] = await this.articlesRepository.findAndCount({
            relations: ['author'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: result,
            count: total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        return this.articlesRepository.findOne({
            where: { id },
            relations: ['author'],
        });
    }

    async update(id: number, updateArticleDto: any) {
        if (updateArticleDto.previewImage) {
            updateArticleDto.previewImage = `/uploads/${updateArticleDto.previewImage}`;
        }
        await this.articlesRepository.update(id, updateArticleDto);
        return this.findOne(id);
    }

    async findWithSearch(query: string, page: number = 1, limit: number = 10) {
        page = page > 0 ? page : 1;
        limit = limit > 0 ? limit : 10;

        const [result, total] = await this.articlesRepository.findAndCount({
            where: [
                { title: Like(`%${query}%`) },
                { content: Like(`%${query}%`) },
            ],
            relations: ['author'],
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            data: result,
            count: total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
    async remove(id: number) {
        await this.articlesRepository.delete(id);
        return { deleted: true };
    }
}