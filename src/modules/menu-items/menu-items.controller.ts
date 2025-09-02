import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('restaurants/:restaurantId/menu-items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuItemDto,
  ) {
    return this.menuItemsService.create(restaurantId, dto);
  }

  @Get()
  findByRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.menuItemsService.findByRestaurant(restaurantId);
  }
}
