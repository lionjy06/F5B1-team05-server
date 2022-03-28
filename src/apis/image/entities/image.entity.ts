import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Product } from 'src/apis/product/entities/product.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field()
  @Column()
  url: string;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Field()
  @ManyToOne(() => Product)
  product: Product;
}
