import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  // Импортируем модуль для работы с TypeORM и регистрируем его для работы с сущностью User
  imports: [TypeOrmModule.forFeature([User]),

    // Импортируем модуль для работы с JWT токенами
    JwtModule.registerAsync({
      imports: [ConfigModule], // Импортируем ConfigModule для доступа к конфигурации
      // Фабричная функция для генерации настроек JWT
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'), // Получаем секретный ключ из конфигурации
        signOptions: { expiresIn: '30d' }, // Устанавливаем срок действия токена
      }),
      inject: [ConfigService], // Инжектим ConfigService для доступа к конфигурации
    }),
  ],
  controllers: [UserController], // Регистрируем контроллер
  providers: [UserService], // Регистрируем сервис
  exports: [UserService], // Экспортируем сервис для использования в других модулях
})
export class UserModule {} // Экспортируем модуль пользователя
