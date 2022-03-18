import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Brand } from "src/apis/brand/entities/brand.entity";
import { ProductSubcategory } from "src/apis/productSubcategory/entities/productSubcategory.entity";

import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class Product{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id: string

    @Column()
    @Field(() => String)
    name:string

    @Column()
    @Field(() => String)
    description: string

    @Column()
    @Field(() => Int)
    price:number

    @Column()
    @Field(() => Int)
    likes:number

    @Column()
    @Field(() => Int)
    views:number

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

   @ManyToOne(() => Brand)
   @Field(() => Brand)
   brand:Brand

   @ManyToOne(() => ProductSubcategory)
   @Field(() => ProductSubcategory)
   productSubcategory:ProductSubcategory
}