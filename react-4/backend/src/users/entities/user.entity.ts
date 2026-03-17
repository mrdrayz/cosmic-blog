import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
    @ApiProperty({ description: 'Identifier of the user' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Email of the user' })
    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @ApiProperty({ description: 'Name of the user' })
    @Column()
    name: string;

    @OneToMany(() => Article, article => article.author)
    articles: Article[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}