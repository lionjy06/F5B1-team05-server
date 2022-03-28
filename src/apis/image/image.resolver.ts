import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Image } from './entities/image.entity';

import { ImageService } from './image.service';

@Resolver()
export class ImageResolver {
  constructor(private readonly imageService: ImageService) {}

  @Mutation(() => [String])
  async uploadImage(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    return await this.imageService.upload({ files });
  }

  @Mutation(() => Image)
  async createImage(
    @Args({ name: 'url', type: () => [String] }) url: string[],
    @Args('productId') productId: string,
  ) {
    return this.imageService.create({ url, productId });
  }

  @Mutation(() => [Image])
  async updateImage(
    @Args('prductId') productId: string,
    @Args({ name: 'url', type: () => [String] }) url: string[],
  ) {
    return this.imageService.update({ productId, url });
  }
}
