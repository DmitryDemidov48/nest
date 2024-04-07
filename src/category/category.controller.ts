import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Req,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { CategoryService } from './category.service'

import { UpdateCategoryDto } from './dto/update-category.dto'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { AuthorGuard } from '../auth/guards/author.guard'
import { CreateCategoryDto } from './dto/create-category.dto'

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    // Создание новой категории
    @Post()
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ValidationPipe())
    create(@Body() createCategoryDto: CreateCategoryDto,@Req() req) {
        return this.categoryService.create(createCategoryDto, +req.user.id);
    }

    // Получение всех категорий пользователя
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Req() req) {
        return this.categoryService.findAll(+req.user.id);
    }

    // Получение информации о конкретной категории
    @Get(':type/:id')
    @UseGuards(JwtAuthGuard, AuthorGuard)
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(+id)
    }

    // Обновление информации о категории
    @Patch(':type/:id')
    @UseGuards(JwtAuthGuard, AuthorGuard)
    update(@Param('id') id: string, @Body() UpdateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(+id, UpdateCategoryDto)
    }

    // Удаление категории
    @Delete(':type/:id')
    @UseGuards(JwtAuthGuard, AuthorGuard)
    remove(@Param('id') id: string) {
        return this.categoryService.remove(+id)
    }
}
