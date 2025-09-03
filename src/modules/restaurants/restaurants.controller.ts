import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMenuItemDto } from '../menu-items/dto/create-menu-item.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.gaurd';
import { ApiResponse } from 'src/common/api-response';

@Controller('restaurants')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findAll() {
    const restaurants = await this.restaurantsService.findAll();
    return ApiResponse.success(restaurants, 'Restaurants fetched successfully');
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async create(@Body() dto: CreateRestaurantDto) {
    const restaurant = await this.restaurantsService.create(dto);
    return ApiResponse.success(restaurant, 'Restaurant created successfully');
  }

  @Get(':id/menu')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async getMenu(@Param('id') id: string) {
    const menu = await this.restaurantsService.getMenu(id);
    return ApiResponse.success(menu, 'Menu fetched successfully');
  }

  @Post(':id/menu')
  @Roles(UserRole.ADMIN)
  async addMenuItem(@Param('id') id: string, @Body() dto: CreateMenuItemDto) {
    const menuItem = await this.restaurantsService.addMenuItem(id, dto);
    return ApiResponse.success(menuItem, 'Menu item added successfully');
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.restaurantsService.remove(id);
    return ApiResponse.success(null, 'Restaurant deleted successfully');
  }
}
