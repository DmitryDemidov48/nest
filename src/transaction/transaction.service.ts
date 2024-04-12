import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'

import { Transaction } from './entities/transaction.entity'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  // Создание новой транзакции
  async create(createTransactionDto: CreateTransactionDto, id: number) {
    const newTransaction = {
      title: createTransactionDto.title,
      amount: createTransactionDto.amount,
      type: createTransactionDto.type,
      category: { id: +createTransactionDto.category },
      user: { id }
    }

    // Проверка наличия данных о транзакции
    if (!newTransaction) {
      throw new BadRequestException('Something went wrong')
    }

    // Сохранение транзакции в базе данных
    return await this.transactionRepository.save(newTransaction)
  }

  // Поиск всех транзакций пользователя
  async findAll(id: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: {
        category: true,
      },
      order: {
        createdAt: 'DESC',
      },
    })
    return transactions
  }

  // Поиск транзакции по идентификатору
  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id,
      },
      relations: {
        user: true,
        category: true,
      },
    })

    // Проверка существования транзакции
    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }
    return transaction
  }

  // Обновление данных транзакции
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    })

    // Проверка существования транзакции
    if (!transaction) throw new NotFoundException('Transaction not found')

    // Обновление данных транзакции
    return await this.transactionRepository.update(id, updateTransactionDto)
  }

  // Удаление транзакции
  async remove(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
    })

    // Проверка существования транзакции
    if (!transaction) {
      throw new NotFoundException('Transaction not found')
    }

    // Удаление транзакции из базы данных
    return await this.transactionRepository.delete(id)
  }

  // Поиск всех транзакций пользователя с пагинацией
  async findAllWithPagination(id: number, page: number, limit: number) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
      },
      relations: {
        category: true,
        user: {
          transactions: true,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    })
    return transactions
  }

  // Поиск всех транзакций пользователя по типу
  async findAllByType(id: number, type: string) {
    const transactions = await this.transactionRepository.find({
      where: {
        user: { id },
        type,
      },
    })

    // Вычисление общей суммы транзакций
    const total = transactions.reduce((acc, obj) => acc + obj.amount, 0)
    return total
  }
}
