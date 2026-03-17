import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'username',
      password: 'password',
      database: 'blog',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true, // Только для разработки, уберите в продакшене
    }),
    UsersModule,
    ArticlesModule,
    CommentsModule,
    AuthModule,
    ImagesModule,
  ],
})
export class AppModule {}
