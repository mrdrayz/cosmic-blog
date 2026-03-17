import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('login')
    @ApiOperation({ summary: 'Аутентификация пользователя' })
    @ApiBody({
        schema: {
            example: { email: 'user@example.com', password: 'password123' },
        },
    })
    @ApiResponse({
        status: 201,
        description: 'Успешная аутентификация',
        schema: { example: { access_token: 'jwt-token-here' } },
    })
    @ApiResponse({
        status: 401,
        description: 'Неправильные учетные данные',
    })
    async login(@Body() loginDto: { email: string; password: string }) {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('refresh')
    @ApiOperation({ summary: 'Обновление JWT токена' })
    @ApiResponse({
        status: 201,
        description: 'Успешное обновление токена',
        schema: { example: { access_token: 'new-jwt-token-here' } },
    })
    @ApiResponse({
        status: 401,
        description: 'Недопустимый или истекший токен',
    })
    async refresh(@Request() req) {
        return this.authService.refreshToken(req.user);
    }
}