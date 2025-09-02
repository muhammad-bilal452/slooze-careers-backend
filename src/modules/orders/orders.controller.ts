import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { OrderStatus } from './enum/order-status.entity';
import { RolesGuard } from '../auth/guards/roles.gaurd';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  create(@Body() dto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(dto, req.user);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  findAll(@Req() req) {
    return this.ordersService.findAll(req.user);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  findOne(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Post(':id/checkout')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  placeOrder(@Param('id') id: string) {
    return this.ordersService.updateStatus(id, { status: OrderStatus.PLACED });
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  cancel(@Param('id') id: string) {
    return this.ordersService.cancelOrder(id);
  }
}
