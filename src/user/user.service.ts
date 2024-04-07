import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto' // Импорт DTO для создания пользователя
import { InjectRepository } from '@nestjs/typeorm' // Импорт декоратора для внедрения репозитория
import { User } from './entities/user.entity' // Импорт сущности пользователя
import { Repository } from 'typeorm' // Импорт репозитория TypeORM для работы с базой данных
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt' // Импорт модуля для хеширования паролей
// Импорт сервиса JWT для работы с JSON Web Tokens

@Injectable() // Пометка класса как Injectable для внедрения зависимостей
export class UserService {
  constructor(
    @InjectRepository(User) // Внедрение репозитория User
    private readonly userRepository: Repository<User>, // Приватное свойство для работы с сущностями пользователей
    private readonly jwtService: JwtService, // Инъекция сервиса для работы с JWT
  ) {}

  async create(createUserDto: CreateUserDto) {
    // Поиск пользователя по email в базе данных
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    })

    // Если пользователь уже существует, выбрасываем BadRequestException
    if (existUser) throw new BadRequestException('This email already exist!')

    // Хеширование пароля с использованием argon2 и сохранение пользователя в базе данных
    const user = await this.userRepository.save({
      email: createUserDto.email,
      password: await argon2.hash(createUserDto.password),
    })

    // Генерация JWT токена для нового пользователя
    const token = this.jwtService.sign({ email: createUserDto.email })

    // Возврат пользователя и JWT токена
    return { user, token }
  }

  async findOne(email: string) {
    // Поиск пользователя по email в базе данных и возврат его
    return await this.userRepository.findOne({
      where: {
        email,
      },
    })
  }
}
