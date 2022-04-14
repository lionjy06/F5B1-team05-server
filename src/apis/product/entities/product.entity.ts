 import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Brand } from "src/apis/brand/entities/brand.entity";
import { ProductLike } from "src/apis/productLike/entities/productLike.entity";
import { Review } from "src/apis/review/entities/review.entity";
import { SubCategory } from "src/apis/subCategory/entities/subCategory.entity";
import { User } from "src/apis/user/entities/user.entity";

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity()
@ObjectType()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    name:string

    @Column()
    @Field(() => String)
    description:string

    @Column()
    @Field(() => Int)
    price:number

    @Column({default:0})
    @Field(() => Int)
    view:number

    @Column({default:0})
    @Field(() => Int)
    like:number

    @Column({nullable:true})
    @Field(() => String,{nullable:true})
    urls?: string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @UpdateDateColumn()
    updatedAt:Date

    @ManyToOne(() => Brand,{cascade:true, onDelete: 'CASCADE' })
    @Field(() => Brand,{nullable:true})
    brand:Brand


    @ManyToOne(() => SubCategory, (subCategory) => subCategory.product)
    @Field(() => SubCategory,{nullable:true})
    subCategory:SubCategory

    @ManyToOne(() => User,{cascade:true, onDelete: 'CASCADE' })
    @Field(() => User,{nullable:true})
    user:User

    @OneToMany((type) => ProductLike, (productLike) => productLike.product)
    productLike: ProductLike[];

   
}