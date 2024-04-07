import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { CategoryModule } from './category/category.module'
import { AuthModule } from './auth/auth.module'
import { TransactionModule } from './transaction/transaction.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  // Импорт модулей
  imports: [
    UserModule, // Модуль для пользователей
    CategoryModule, // Модуль для категорий
    AuthModule, // Модуль для аутентификации
    TransactionModule, // Модуль для транзакций
    ConfigModule.forRoot({ isGlobal: true }), // Модуль для работы с конфигурацией приложения
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], // Импорт ConfigModule для доступа к конфигурации
      useFactory: (configService: ConfigService) => ({
        type: 'postgres', // Тип базы данных
        host: configService.get('DB_HOST'), // Хост базы данных
        port: configService.get('DB_PORT'), // Порт базы данных
        username: configService.get('DB_USERNAME'), // Имя пользователя базы данных
        password: configService.get('DB_PASSWORD'), // Пароль пользователя базы данных
        database: configService.get('DB_NAME'), // Название базы данных
        synchronize: true, // Автоматическое обновление схемы базы данных
        entities: [__dirname + '/**/*.entity{.js, .ts }'], // Пути к сущностям базы данных
      }),
      inject: [ConfigService], // Инъекция сервиса ConfigService для доступа к конфигурации
    }),
  ],
  // Контроллеры приложения
  controllers: [AppController],
  // Провайдеры приложения
  providers: [AppService],
})
export class AppModule {} // Экспорт AppModule
