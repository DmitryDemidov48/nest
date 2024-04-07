import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {TransactionService} from './transaction.service'
import {CreateTransactionDto} from './dto/create-transaction.dto'
import {UpdateTransactionDto} from './dto/update-transaction.dto'
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard'
import {AuthorGuard} from "../auth/guards/author.guard";

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  // Создание новой транзакции
  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
    return this.transactionService.create(createTransactionDto, +req.user.id)

  }

  // Поиск всех транзакций пользователя по типу
  @Get(':type/find')
  @UseGuards(JwtAuthGuard)
  findAllByType(@Req() req, @Param('type') type: string) {
    return this.transactionService.findAllByType(+req.user.id, type)
  }

  // Поиск всех транзакций пользователя с пагинацией
  @Get('pagination')
  @UseGuards(JwtAuthGuard)
  findAllWithPagination(
    @Req() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 3,
  ) {
    return this.transactionService.findAllWithPagination(
      +req.user.id,
      +page,
      +limit,
    )
  }

  // Поиск всех транзакций пользователя
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req) {
    return this.transactionService.findAll(+req.user.id)
  }

  // Поиск транзакции по идентификатору
  @Get(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id)
  }

  // Обновление данных транзакции
  @Patch(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  update(
      @Param('id') id: string,
         @Body() updateTransactionDto: UpdateTransactionDto
  ) {
    return this.transactionService.update(+id, updateTransactionDto)
  }

  // Удаление транзакции
  @Delete(':type/:id')
  @UseGuards(JwtAuthGuard, AuthorGuard)
  remove(@Param('id') id: string) {
    return this.transactionService.remove(+id)
  }
}
