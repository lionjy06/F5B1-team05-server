import { Field, ObjectType } from "@nestjs/graphql";
import { ProductMaincategory } from "src/apis/productMaincategory/entities/productMaincategory.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

 

 @Entity()
 @ObjectType()
 export class ProductSubcategory{
     @PrimaryGeneratedColumn('uuid')
     @Field(() => String)
     id:string

     @Column()
     @Field(() => String)
     name:string

     @DeleteDateColumn()
     deletedAt:Date

     @ManyToOne(() => ProductMaincategory)
     @Field(()=>ProductMaincategory)
     productMaincategory:ProductMaincategory
 }