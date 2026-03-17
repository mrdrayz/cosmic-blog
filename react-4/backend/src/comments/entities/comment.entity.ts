import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Article } from '../../articles/entities/article.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Comment {
    @ApiProperty({ description: 'Identifier of the comment' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Content of the comment' })
    @Column('text')
    content: string;

    @ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
    user: User;

    @ManyToOne(() => Article, article => article.comments, { onDelete: 'CASCADE' })
    article: Article;
}