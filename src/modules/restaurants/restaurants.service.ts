import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from './entity/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { MenuItemsService } from '../menu-items/menu-items.service';
import { CreateMenuItemDto } from '../menu-items/dto/create-menu-item.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,

    private menuItemService: MenuItemsService,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const existing = await this.restaurantRepository.findOne({
      where: { name: createRestaurantDto.name },
    });
    if (existing) {
      throw new ConflictException(
        `Restaurant with name "${createRestaurantDto.name}" already exists`,
      );
    }

    const restaurant = this.restaurantRepository.create(createRestaurantDto);
    return this.restaurantRepository.save(restaurant);
  }

  async findAll(): Promise<Restaurant[]> {
    return this.restaurantRepository.find({ relations: ['menuItems'] });
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['menuItems'],
    });
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID "${id}" not found`);
    }
    return restaurant;
  }

  async getMenu(id: string) {
    return this.menuItemService.findByRestaurant(id);
  }

  async addMenuItem(id: string, createMenuItemDto: CreateMenuItemDto) {
    return this.menuItemService.create(id, createMenuItemDto);
  }

  async remove(id: string): Promise<void> {
    const restaurant = await this.findOne(id);
    await this.restaurantRepository.remove(restaurant);
  }
}
