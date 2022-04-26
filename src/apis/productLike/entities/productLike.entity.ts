import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "../../product/entities/product.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
@ObjectType()
export class ProductLike{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string;
  
    @ManyToOne(() => User, (user) => user.productLike)
    @Field(() => User)
    user: User;
  
    @ManyToOne(() => Product, (product) => product.productLike)
    @Field(() => Product)
    product: Product;
  
    @Column({ default: false })
    @Field(() => Boolean)
    islike: Boolean;
  
    @CreateDateColumn()
    createAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletdAt: Date;
}