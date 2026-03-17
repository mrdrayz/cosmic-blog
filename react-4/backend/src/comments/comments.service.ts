import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../users/entities/user.entity';
import { Article } from '../articles/entities/article.entity';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentsRepository: Repository<Comment>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        @InjectRepository(Article)
        private articlesRepository: Repository<Article>,
    ) {}

    async create(commentDto: { content: string; userId: number; articleId: number }) {
        const user = await this.usersRepository.findOne({
            where: { id: commentDto.userId },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const article = await this.articlesRepository.findOne({
            where: { id: commentDto.articleId },
        });
        if (!article) {
            throw new NotFoundException('Article not found');
        }

        const comment = this.commentsRepository.create({
            content: commentDto.content,
            user,
            article,
        });

        return this.commentsRepository.save(comment);
    }

    async findAll(page: number, limit: number) {
        const [result, total] = await this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoin('comment.article', 'article')
            .select([
                'comment.id',
                'comment.content',
                'user.id',
                'user.name',
                'article.id'
            ])
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const data = result.map(comment => ({
            id: comment.id,
            content: comment.content,
            user: comment.user,
            articleId: comment.article?.id,
        }));

        return {
            data,
            count: total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }

    async findOne(id: number) {
        const comment = await this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.article', 'article')
            .select(['comment.id', 'comment.content', 'user.id', 'user.name', 'comment.article'])
            .where('comment.id = :id', { id })
            .getOne();

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        return {
            id: comment.id,
            content: comment.content,
            user: comment.user,
            articleId: comment.article?.id,
        };
    }

    async update(id: number, updateCommentDto: any) {
        await this.commentsRepository.update(id, updateCommentDto);
        return this.findOne(id);
    }

    async remove(id: number) {
        await this.commentsRepository.delete(id);
        return { deleted: true };
    }

    async findByArticleId(articleId: number, page: number, limit: number) {
        const [result, total] = await this.commentsRepository.createQueryBuilder('comment')
            .leftJoinAndSelect('comment.user', 'user')
            .leftJoinAndSelect('comment.article', 'article')
            .select(['comment.id', 'comment.content', 'user.id', 'user.name', 'comment.article'])
            .where('article.id = :articleId', { articleId })
            .skip((page - 1) * limit)
            .take(limit)
            .getManyAndCount();

        const data = result.map(comment => ({
            id: comment.id,
            content: comment.content,
            user: comment.user,
            articleId: comment.article?.id,
        }));

        return {
            data,
            count: total,
            page,
            pageCount: Math.ceil(total / limit),
        };
    }
}