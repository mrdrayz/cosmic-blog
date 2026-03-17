import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const filename: string = uuidv4() + path.extname(file.originalname);
        cb(null, filename);
    },
});

@ApiTags('images')
@Controller('images')
export class ImagesController {

    @UseGuards(JwtAuthGuard)
    @Post('upload')
    @UseInterceptors(FilesInterceptor('files', 10, { storage }) as any)
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Загрузить изображения' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
        const imageUrls = files.map(file => `/uploads/${file.filename}`);
        return { imageUrls };
    }
}