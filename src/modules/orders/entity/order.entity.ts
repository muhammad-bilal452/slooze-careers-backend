import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Restaurant } from '../../restaurants/entity/restaurant.entity';

import { OrderStatus } from '../enum/order-status.entity';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from 'src/modules/payment-method/entity/payment-method.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true })
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.id, { eager: true })
  restaurant: Restaurant;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
    eager: true,
  })
  items: OrderItem[];

  @ManyToOne(() => PaymentMethod, { eager: true })
  paymentMethod: PaymentMethod;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
