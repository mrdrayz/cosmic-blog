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
    UnauthorizedException, NotFoundException
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiResponse,
    ApiBearerAuth
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Создать новый комментарий' })
    @ApiBody({ schema: { example: { content: 'Текст комментария', articleId: 1 } } })
    @ApiResponse({ status: 201, description: 'Комментарий успешно создан', type: Comment })
    async create(
        @Body() createCommentDto: { content: string; articleId: number },
        @Request() req,
    ) {
        return this.commentsService.create({
            ...createCommentDto,
            userId: req.user.userId,
        });
    }

    @Get()
    @ApiOperation({ summary: 'Получить все комментарии с пагинацией' })
    @ApiResponse({ status: 200, description: 'Пагинированный список всех комментариев', type: [Comment] })
    async findAll(@Request() req) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        return this.commentsService.findAll(page, limit);
    }

    @Get('article/:articleId')
    @ApiParam({ name: 'articleId', description: 'Идентификатор статьи' })
    @ApiOperation({ summary: 'Получить пагинированный список комментариев для статьи' })
    @ApiResponse({ status: 200, description: 'Пагинированный список комментариев для статьи', type: [Comment] })
    async findCommentsByArticle(
        @Param('articleId') articleId: string,
        @Request() req,
    ) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        return this.commentsService.findByArticleId(+articleId, page, limit);
    }

    @Get(':id')
    @ApiParam({ name: 'id', description: 'Идентификатор комментария' })
    @ApiOperation({ summary: 'Получить комментарий по ID' })
    @ApiResponse({ status: 200, description: 'Информация о комментарии', type: Comment })
    async findOne(@Param('id') id: string) {
        return this.commentsService.findOne(+id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    @ApiParam({ name: 'id', description: 'Идентификатор комментария' })
    @ApiOperation({ summary: 'Обновить комментарий' })
    @ApiBody({ schema: { example: { content: 'Обновленный текст комментария' } } })
    @ApiResponse({ status: 200, description: 'Комментарий успешно обновлен', type: Comment })
    async update(@Param('id') id: string, @Body() updateCommentDto: any) {
        return this.commentsService.update(+id, updateCommentDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiParam({ name: 'id', description: 'Идентификатор комментария' })
    @ApiOperation({ summary: 'Удалить комментарий' })
    @ApiResponse({ status: 200, description: 'Комментарий успешно удален' })
    async remove(@Param('id') id: string, @Request() req) {
        const comment = await this.commentsService.findOne(+id);
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.user.id !== req.user.userId) {
            throw new UnauthorizedException('You do not have permission to delete this comment');
        }
        return this.commentsService.remove(+id);
    }
}