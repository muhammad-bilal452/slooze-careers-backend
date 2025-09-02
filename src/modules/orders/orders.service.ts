import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../users/entity/user.entity';
import { UserRole } from '../users/enum/role.enum';
import { OrderStatus } from './enum/order-status.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { MenuItemsService } from '../menu-items/menu-items.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    private restaurantService: RestaurantsService,
    private menuItemService: MenuItemsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    const restaurant = await this.restaurantService.findOne(
      createOrderDto.restaurantId,
    );

    const items: OrderItem[] = [];
    for (const itemDto of createOrderDto.items) {
      const menuItem = await this.menuItemService.findOne(itemDto.menuItemId);

      const orderItem = this.orderItemRepository.create({
        menuItem,
        quantity: itemDto.quantity,
        price: menuItem.price,
      });
      items.push(orderItem);
    }

    const order = this.orderRepository.create({
      restaurant,
      user,
      items,
      status: OrderStatus.PENDING,
    });

    return this.orderRepository.save(order);
  }

  async findAll(user: User): Promise<Order[]> {
    if (user.role === UserRole.ADMIN) {
      return this.orderRepository.find();
    } else {
      return this.orderRepository.find({ where: { user: { id: user.id } } });
    }
  }

  async findById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, dto: UpdateOrderDto): Promise<Order> {
    const order = await this.findById(id);

    order.status = dto.status ?? order.status;
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.findById(id);

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }
}
