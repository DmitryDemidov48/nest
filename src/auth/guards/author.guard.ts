import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from '../../transaction/transaction.service';
import { CategoryService } from '../../category/category.service';

@Injectable()
export class AuthorGuard implements CanActivate {
  constructor(
      private readonly transactionService: TransactionService,
      private readonly categoryService: CategoryService,
  ) {}

  // Метод canActivate проверяет, имеет ли текущий пользователь право доступа к ресурсу
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Получаем запрос из контекста выполнения
    const request = context.switchToHttp().getRequest();
    // Извлекаем параметры запроса: id и тип
    const { id, type } = request.params;

    let entity

    // В зависимости от типа запроса, получаем соответствующую сущность
    switch (type) {
      case 'transaction':
        entity = await this.transactionService.findOne(id);
        break
      case 'category':
        entity = await this.categoryService.findOne(id);
        break
      default:
        throw new NotFoundException('Something went wrong...');
    }

    // Получаем информацию о текущем пользователе из запроса
    const user = request.user;

    // Проверяем, совпадает ли пользователь, сделавший запрос, с пользователем, связанным с сущностью
    if (entity && user && entity.user.id === user.id) {
      // Если совпадает, возвращаем true (разрешаем доступ)
      return true;
    }
    // Если нет совпадения или информация о сущности отсутствует, выбрасываем исключение BadRequestException
    throw new BadRequestException('Something went wrong...');
  }
}
