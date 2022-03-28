import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { Image } from './entities/image.entity';
import { ImageResolver } from './image.resolver';
import { ImageService } from './image.service';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Product])],
  providers: [ImageService, ImageResolver],
})
export class ImageModule {}
