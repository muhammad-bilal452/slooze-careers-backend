import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { MenuItemsModule } from '../menu-items/menu-items.module';

@Module({
  imports: [
    RestaurantsModule,
    MenuItemsModule,
    TypeOrmModule.forFeature([Order, OrderItem]),
  ],
  providers: [OrdersService, JwtAuthGuard],
  controllers: [OrdersController],
})
export class OrdersModule {}
