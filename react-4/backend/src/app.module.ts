import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { join } from 'path';
import { ArticlesModule } from './articles/articles.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';

function getDatabaseConfig() {
  const databaseUrl = process.env.DATABASE_URL;

  if (databaseUrl) {
    return {
      type: 'postgres' as const,
      url: databaseUrl,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
      ssl: { rejectUnauthorized: false },
    };
  }

  return {
    type: 'postgres' as const,
    host: 'localhost',
    port: 5432,
    username: 'username',
    password: 'password',
    database: 'blog',
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize: true,
  };
}

@Module({
  imports: [
    TypeOrmModule.forRoot(getDatabaseConfig()),
    UsersModule,
    ArticlesModule,
    CommentsModule,
    AuthModule,
    ImagesModule,
  ],
})
export class AppModule {}
