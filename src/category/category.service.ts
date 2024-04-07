import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto'; // Импорт DTO для создания категории
import { UpdateCategoryDto } from './dto/update-category.dto'; // Импорт DTO для обновления категории
import {Repository} from "typeorm";
import {Category} from "./entities/category.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class CategoryService {
  constructor(
      @InjectRepository(Category)
      private readonly categoryRepository: Repository<Category>, // Инъекция репозитория для работы с категориями
  ) {}

  // Метод создания новой категории
  async create(createCategoryDto: CreateCategoryDto, id: number) {
    // Проверяем, существует ли категория с таким же названием для указанного пользователя
    const isExist = await this.categoryRepository.findBy({
      user: { id },
      title: createCategoryDto.title
    })
    // Если категория уже существует, выбрасываем исключение BadRequestException
    if (isExist.length)
      throw new BadRequestException('This category already exist!')

    // Создаем новую категорию
    const newCategory = {
      title: createCategoryDto.title,
      user: {
        id,
      },
    };
    // Сохраняем новую категорию в базе данных
    return await this.categoryRepository.save(newCategory)
  }

  // Метод для поиска всех категорий пользователя
  async findAll(id: number) {
    // Возвращаем все категории пользователя с указанным id
    return await this.categoryRepository.find({
      where: {
        user: {id},
      },
      relations: {
        transactions: true, // Возвращаем также связанные транзакции
      }
    })
  }

  // Метод для поиска одной категории по id
  async findOne(id: number) {
    // Ищем категорию по указанному id
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        user: true, // Возвращаем информацию о пользователе
        transactions: true, // Возвращаем также связанные транзакции
      },
    })
    // Если категория не найдена, выбрасываем исключение NotFoundException
    if (!category) throw new NotFoundException('Category not found')
    return category
  }

  // Метод для обновления категории
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    // Ищем категорию по указанному id
    const category = await this.categoryRepository.findOne({
      where: { id },
    })
    // Если категория не найдена, выбрасываем исключение NotFoundException
    if (!category) throw new NotFoundException('Category not found!')
    // Обновляем категорию в базе данных
    return await this.categoryRepository.update(id, updateCategoryDto)
  }

  // Метод для удаления категории по id
  async remove(id: number) {
    // Ищем категорию по указанному id
    const category = await this.categoryRepository.findOne({
      where: { id },
    })
    // Если категория не найдена, выбрасываем исключение NotFoundException
    if (!category) throw new NotFoundException('Category not found!')
    // Удаляем категорию из базы данных
    return await this.categoryRepository.delete(id)
  }
}
