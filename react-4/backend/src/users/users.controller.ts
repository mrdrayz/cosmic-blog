import {
    Controller,
    Post,
    Body,
    Param,
    Patch,
    Delete,
    Get,
    UseGuards, Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
    ApiResponse,
    ApiBearerAuth,
    ApiConflictResponse,
    ApiNotFoundResponse,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}
    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Получение текущего авторизованного пользователя' })
    @ApiResponse({ status: 200, description: 'Возвращает информацию о текущем пользователе', type: User })
    async getCurrentUser(@Req() req: any) {
        const user = req.user as { userId: number };
        return this.usersService.getCurrentUser(user.userId);
    }

    @Post('register')
    @ApiOperation({ summary: 'Регистрация нового пользователя' })
    @ApiBody({ schema: { example: { email: 'user@example.com', password: 'password123', name: 'John Doe' } } })
    @ApiResponse({ status: 201, description: 'Пользователь успешно зарегистрирован', type: User })
    @ApiConflictResponse({ description: 'Этот email уже зарегистрирован' })
    async register(@Body() createUserDto: { email: string; password: string; name: string }) {
        return this.usersService.create(createUserDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить информацию о пользователе по ID' })
    @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
    @ApiResponse({ status: 200, description: 'Возвращает информацию о пользователе', type: User })
    @ApiNotFoundResponse({ description: 'Пользователь не найден' })
    async findOne(@Param('id') id: string) {
        return this.usersService.findById(+id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id')
    @ApiOperation({ summary: 'Обновить данные пользователя' })
    @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
    @ApiBody({ schema: { example: { name: 'New Name' } } })
    @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен', type: User })
    @ApiNotFoundResponse({ description: 'Пользователь не найден' })
    async update(@Param('id') id: string, @Body() updateUserDto: any) {
        return this.usersService.update(+id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить пользователя' })
    @ApiParam({ name: 'id', description: 'Идентификатор пользователя' })
    @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
    @ApiNotFoundResponse({ description: 'Пользователь не найден' })
    async remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
}