import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import { Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/entities/product.entity';
import { Image } from './entities/image.entity';

dotenv.config();
interface IUpload {
  files: FileUpload[];
}

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async upload({ files }: IUpload) {
    const storage = new Storage({
      keyFilename: 'planar-door-341008-0acf66c366c4.json',
      projectId: 'planar-door-341008',
    }).bucket('mycodecamp');
    const waitedFiles = await Promise.all(files);

    const urls = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () => {
              resolve(`mycodecamp/${file.filename}`);
            })
            .on('error', (error) => reject(error));
        });
      }),
    );
    console.log(files, urls);

    return urls;
  }

  async create({ url, productId }) {
    const product = await this.productRepository.create({ id: productId });
    for (let i = 0; i < url.length; i++) {
      await this.imageRepository.save({
        product,
        url: url[i],
      });
    }
  }

  async update({ productId, url }) {
    const product = await this.productRepository.create({ id: productId });
    const image = await this.imageRepository.find({ product });

    // const storage = new Storage({
    //   keyFilename: process.env.STORAGE_KEY_FILENAME,
    //   projectId: process.env.STORAGE_PROJECT_ID,
    // }).bucket(process.env.STORAGE_BUCKET).file;

    const waitedUrl = await Promise.all(url);
    console.log('ㅇ이게 내보고싶은거임:', waitedUrl);
    for (let i = 0; i < image.length; i++) {
      const result = await this.imageRepository.softDelete({ id: image[i].id });
      result.affected ? true : false;
    }

    for (let i = 0; i < url.length; i++) {
      await this.imageRepository.save({
        product,
        url: url[i],
      });
    }
  }
}
