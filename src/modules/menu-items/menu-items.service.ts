import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './entity/menu-item.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { Restaurant } from '../restaurants/entity/restaurant.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(
    restaurantId: string,
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });
    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID "${restaurantId}" not found`,
      );
    }

    const existing = await this.menuItemRepository.findOne({
      where: { name: createMenuItemDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Menu item with name "${createMenuItemDto.name}" already exists`,
      );
    }

    const menuItem = this.menuItemRepository.create({
      ...createMenuItemDto,
      restaurant,
    });
    return this.menuItemRepository.save(menuItem);
  }

  async findByRestaurant(restaurantId: string): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { restaurant: { id: restaurantId } },
      relations: ['restaurant'],
    });
  }
}
