import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.gaurd';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enum/role.enum';
import { ApiResponse } from 'src/common/api-response';

@Controller('restaurants/:restaurantId/menu-items')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('access-token')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    const menuItem = await this.menuItemsService.create(restaurantId, dto);
    return ApiResponse.success(menuItem, 'Menu item created successfully');
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findByRestaurant(@Param('restaurantId') restaurantId: string) {
    const menuItems =
      await this.menuItemsService.findByRestaurant(restaurantId);
    return ApiResponse.success(menuItems, 'Menu items fetch successfully');
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.MEMBER)
  async findOnefund(@Param('id') id: string) {
    const menuItem = await this.menuItemsService.findOne(id);
    return ApiResponse.success(menuItem, 'Menu item fetched successfully');
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.menuItemsService.remove(id);
    return ApiResponse.success(null, 'Menu item deleted successfully');
  }
}
