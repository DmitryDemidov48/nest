import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Category } from '../../category/entities/category.entity'
import { Transaction } from '../../transaction/entities/transaction.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number // Уникальный идентификатор пользователя, автоматически генерируемый

  @Column()
  email: string // Адрес электронной почты пользователя

  @Column()
  password: string // Пароль пользователя

  @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'CASCADE',
  })
  categories: Category[] // Массив категорий, связанных с пользователем

  @OneToMany(() => Transaction, (transaction) => transaction.user, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[] // Массив транзакций, связанных с пользователем

  @CreateDateColumn()
  createdAt: Date // Дата и время создания записи о пользователе

  @UpdateDateColumn()
  updatedAt: Date // Дата и время последнего обновления записи о пользователе
}
