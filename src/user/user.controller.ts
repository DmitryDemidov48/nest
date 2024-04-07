import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe, Get,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/create-user.dto'

@Controller('user') // Определяем контроллер и указываем его путь
export class UserController {
  constructor(private readonly userService: UserService) {} // Внедряем сервис пользователя

  @Post() // Обрабатываем POST запросы
  @UsePipes(new ValidationPipe()) // Используем валидацию DTO с помощью ValidationPipe
  // Создаем метод для создания пользователя, принимаем данные через тело запроса
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto) // Вызываем метод сервиса для создания пользователя
  }

}
