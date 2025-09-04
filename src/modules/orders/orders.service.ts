import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { PaymentMethodsService } from '../payment-method/payment-method.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    private restaurantService: RestaurantsService,
    private menuItemService: MenuItemsService,
    private paymentMethodService: PaymentMethodsService,
  ) {}

  async create(createOrderDto: CreateOrderDto, user: User): Promise<Order> {
    let order = await this.orderRepository.findOne({
      where: {
        user: { id: user.id },
        restaurant: { id: createOrderDto.restaurantId },
        status: OrderStatus.PENDING,
      },
      relations: ['items', 'items.menuItem', 'restaurant', 'paymentMethod'],
    });

    const newItems: OrderItem[] = [];
    for (const itemDto of createOrderDto.items) {
      const menuItem = await this.menuItemService.findOne(itemDto.menuItemId);

      const orderItem = this.orderItemRepository.create({
        menuItem,
        quantity: itemDto.quantity,
        price: menuItem.price,
      });

      newItems.push(orderItem);
    }

    let paymentMethod;
    if (createOrderDto.paymentMethodId) {
      paymentMethod = await this.paymentMethodService.findById(
        createOrderDto.paymentMethodId,
      );
    }

    if (order) {
      for (const newItem of newItems) {
        const existingItem = order.items.find(
          (i) => i.menuItem.id === newItem.menuItem.id,
        );
        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          order.items.push(newItem);
        }
      }

      if (paymentMethod) {
        order.paymentMethod = paymentMethod;
      }

      return this.orderRepository.save(order);
    } else {
      const restaurant = await this.restaurantService.findOne(
        createOrderDto.restaurantId,
      );

      order = this.orderRepository.create({
        restaurant,
        user,
        items: newItems,
        status: OrderStatus.PENDING,
        paymentMethod,
      });

      return this.orderRepository.save(order);
    }
  }

  async findAll(user: User): Promise<Order[]> {
    if (user.role === UserRole.ADMIN || user.role === UserRole.MANAGER) {
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

  async updateStatus(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findById(id);

    const paymentMethod = await this.paymentMethodService.findById(
      updateOrderDto.paymentMethodId,
    );

    order.paymentMethod = paymentMethod;
    order.status = updateOrderDto.status ?? order.status;
    return this.orderRepository.save(order);
  }

  async cancelOrder(id: string): Promise<Order> {
    const order = await this.findById(id);

    order.status = OrderStatus.CANCELLED;
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findById(id);
    await this.orderRepository.remove(order);
  }
}
