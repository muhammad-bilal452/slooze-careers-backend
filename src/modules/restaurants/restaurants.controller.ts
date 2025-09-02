import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMenuItemDto } from '../menu-items/dto/create-menu-item.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('restaurants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  findAll() {
    return this.restaurantsService.findAll();
  }

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Get(':id/menu')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  getMenu(@Param('id') id: string) {
    return this.restaurantsService.getMenu(id);
  }

  @Post(':id/menu')
  @Roles(UserRole.ADMIN)
  addMenuItem(@Param('id') id: string, @Body() dto: CreateMenuItemDto) {
    return this.restaurantsService.addMenuItem(id, dto);
  }
}
