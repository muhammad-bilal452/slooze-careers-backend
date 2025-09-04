import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrderStatus } from './enum/order-status.entity';
import { RolesGuard } from '../auth/guards/roles.gaurd';
import { ApiResponse } from 'src/common/api-response';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PlaceOrderDto } from './dto/place-order.dto';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async create(@Body() dto: CreateOrderDto, @Req() req) {
    const order = await this.ordersService.create(dto, req.user);
    return ApiResponse.success(order, 'Order create successfully');
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findAll(@Req() req) {
    const orders = await this.ordersService.findAll(req.user);
    return ApiResponse.success(orders, 'Orders fetched successfully');
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findOne(@Param('id') id: string) {
    const order = await this.ordersService.findById(id);
    return ApiResponse.success(order, 'Order fetched successfully');
  }

  @Post(':id/checkout')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async placeOrder(
    @Param('id') id: string,
    @Body() placeOrderDto: PlaceOrderDto,
  ) {
    const order = await this.ordersService.updateStatus(id, {
      status: OrderStatus.PLACED,
      paymentMethodId: placeOrderDto.paymentMethodId,
    });
    return ApiResponse.success(order, 'Order placed successfully');
  }

  @Delete(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async cancel(@Param('id') id: string) {
    const order = await this.ordersService.cancelOrder(id);
    return ApiResponse.success(order, 'Order cancelled successfully');
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.ordersService.remove(id);
    return ApiResponse.success(null, 'Order deleted successfully');
  }
}
