import {
  Controller,
  Get,
  Put,
  Post,
  Param,
  Body,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaymentMethodsService } from './payment-method.service';
import { RolesGuard } from '../auth/guards/roles.gaurd';
import { ApiResponse } from 'src/common/api-response';

@Controller('payment-methods')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodService: PaymentMethodsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findAll() {
    const paymentMethods = await this.paymentMethodService.findAll();
    return ApiResponse.success(
      paymentMethods,
      'Payment Methods fetched successfully',
    );
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findById(@Param('id') id: string) {
    const paymentMethod = await this.paymentMethodService.findById(id);
    return ApiResponse.success(
      paymentMethod,
      'Payment mehtod fetched successfully',
    );
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodService.create(dto);
    return ApiResponse.success(
      paymentMethod,
      'Payment method created successfully',
    );
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentMethodDto) {
    const paymentMethod = await this.paymentMethodService.update(id, dto);
    return ApiResponse.success(
      paymentMethod,
      'Payment method updated successfully',
    );
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.paymentMethodService.remove(id);
    return ApiResponse.success(null, 'Payment method deleted successfully');
  }
}
