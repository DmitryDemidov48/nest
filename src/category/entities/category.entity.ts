import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { User } from '../../user/entities/user.entity'
import { Transaction } from '../../transaction/entities/transaction.entity'
import { JoinColumn } from 'typeorm'

@Entity()
export class Category {
  @PrimaryGeneratedColumn({ name: 'category_id' })
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, (user) => user.categories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Transaction, (transaction) => transaction.category)
  @JoinColumn({ name: 'transaction_id' })
  transactions: Transaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
