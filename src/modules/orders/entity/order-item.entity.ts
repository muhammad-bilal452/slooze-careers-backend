import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuItem } from '../../menu-items/entity/menu-item.entity';
import { Order } from 'src/modules/orders/entity/order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  order: Order;

  @ManyToOne(() => MenuItem, { eager: true })
  menuItem: MenuItem;

  @Column()
  quantity: number;

  @Column('decimal')
  price: number; // snapshot of menuItem price

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
