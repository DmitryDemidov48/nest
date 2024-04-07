import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../types/types';

@Injectable() // Декоратор Injectable для обозначения сервиса
export class AuthService {
  constructor(
      private readonly userService: UserService, // Внедряем UserService для работы с пользователями
      private readonly jwtService: JwtService, // Внедряем JwtService для работы с JWT токенами
  ) {}

  async validateUser(email: string, password: string)  {
    const user = await this.userService.findOne(email); // Находим пользователя по email
    if (!user) { // Если пользователя нет
      throw new UnauthorizedException('User not found!'); // Вызываем исключение о неавторизованном доступе
    }
    const passwordIsMatch = await argon2.verify(user.password, password); // Проверяем совпадение паролей
    if (passwordIsMatch) { // Если пароли совпадают
      return user; // Возвращаем пользователя
    }
    throw new UnauthorizedException('User password is incorrect!'); // Иначе вызываем исключение о неправильном пароле
  }

  async login(user: IUser) {
    const { id, email } = user; // Деструктурируем id и email из объекта пользователя
    const token = this.jwtService.sign({ id, email }); // Генерируем JWT токен для пользователя
    return { id, email, token }; // Возвращаем данные пользователя вместе с токеном
  }
}
