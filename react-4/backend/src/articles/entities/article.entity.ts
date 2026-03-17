import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Comment } from '../../comments/entities/comment.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Article {
    @ApiProperty({ description: 'Identifier of the article' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Title of the article' })
    @Column()
    title: string;

    @ApiProperty({ description: 'Content of the article' })
    @Column('text')
    content: string;

    @ApiProperty({ description: 'Preview image of the article', nullable: true })
    @Column({ nullable: true })
    previewImage: string;

    @ManyToOne(() => User, user => user.articles, { onDelete: 'CASCADE' })
    author: User;

    @OneToMany(() => Comment, comment => comment.article, { cascade: true })
    comments: Comment[];
}