import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsController } from './menu-items.controller';
import { MenuItem } from './entity/menu-item.entity';
import { Restaurant } from '../restaurants/entity/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, Restaurant])],
  controllers: [MenuItemsController],
  providers: [MenuItemsService],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
