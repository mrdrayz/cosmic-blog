import {
    Controller,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Get,
    UseGuards,
    Request,
    UnauthorizedException,
    NotFoundException,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
    ApiBody,
    ApiResponse,
    ApiConsumes,
    ApiQuery
} from '@nestjs/swagger';
import { Article } from './entities/article.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Express } from 'express';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const filename: string = uuidv4() + path.extname(file.originalname);
        cb(null, filename);
    },
});

@ApiTags('articles')
@Controller('articles')
export class ArticlesController {
    constructor(private readonly articlesService: ArticlesService) {
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({summary: 'Создать новую статью'})
    @UseInterceptors(FileInterceptor('previewImage', {storage}) as any)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string'},
                content: {type: 'string'},
                previewImage: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Статья успешно создана',
        type: Article,
    })
    async create(
        @Body() createArticleDto: { title: string; content: string },
        @UploadedFile() file: Express.Multer.File,
        @Request() req,
    ) {
        const previewImageUrl = file ? `/uploads/${file.filename}` : null;
        return this.articlesService.create({
            ...createArticleDto,
            previewImage: previewImageUrl,
            authorId: req.user.userId,
        });
    }

    @Get()
    @ApiOperation({summary: 'Получить все статьи с пагинацией или выполнить поиск по заголовку и содержанию'})
    @ApiQuery({name: 'query', required: false, description: 'Ключевое слово для поиска', type: String})
    @ApiQuery({name: 'page', required: false, description: 'Page number', type: Number})
    @ApiQuery({name: 'limit', required: false, description: 'Number of items per page', type: Number})
    @ApiResponse({
        status: 200,
        description: 'Пагинированный список всех доступных статей или статей, подходящих под поисковый запрос',
        type: [Article],
    })
    async findAllOrSearch(@Request() req) {
        const query = req.query.query || '';
        const page = Number(req.query.page) > 0 ? Number(req.query.page) : 1;
        const limit = Number(req.query.limit) > 0 ? Number(req.query.limit) : 10;

        return query ?
            this.articlesService.findWithSearch(query, page, limit) :
            this.articlesService.findAll(page, limit);
    }

    @Get(':id')
    @ApiParam({name: 'id', description: 'Идентификатор статьи'})
    @ApiOperation({summary: 'Получить статью по ID'})
    @ApiResponse({
        status: 200,
        description: 'Информация о выбранной статье',
        type: Article,
    })
    @ApiResponse({
        status: 404,
        description: 'Статья не найдена',
    })
    async findOne(@Param('id') id: string) {
        return this.articlesService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    @ApiParam({name: 'id', description: 'Идентификатор статьи'})
    @ApiOperation({summary: 'Обновить статью'})
    @ApiBody({
        schema: {
            example: {title: 'Обновленный заголовок', content: 'Обновленный текст'},
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Статья успешно обновлена',
        type: Article,
    })
    @ApiResponse({
        status: 404,
        description: 'Статья не найдена',
    })
    async update(
        @Param('id') id: string,
        @Body() updateArticleDto: any,
    ) {
        return this.articlesService.update(+id, updateArticleDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiParam({name: 'id', description: 'Идентификатор статьи'})
    @ApiOperation({summary: 'Удалить статью'})
    @ApiResponse({
        status: 200,
        description: 'Статья успешно удалена',
    })
    @ApiResponse({
        status: 404,
        description: 'Статья не найдена',
    })
    @ApiResponse({
        status: 403,
        description: 'Доступ запрещен. Только автор может удалить статью.',
    })
    async remove(@Param('id') id: string, @Request() req) {
        const article = await this.articlesService.findOne(+id);
        if (!article) {
            throw new NotFoundException('Статья не найдена');
        }

        if (article.author.id !== req.user.userId) {
            throw new UnauthorizedException('Вы не имеете права удалять эту статью');
        }

        return this.articlesService.remove(+id);
    }
}