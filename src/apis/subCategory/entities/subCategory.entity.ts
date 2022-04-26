import { Field,  ObjectType } from "@nestjs/graphql";
import { MainCategory } from "../../mainCategory/entities/mainCategory.entity";
import { Product } from "../../product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class SubCategory{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    name:string

    @OneToMany((type)=>Product, (product) => product.subCategory)
    product:Product[]

    @ManyToOne(() => MainCategory, (mainCategory)=>mainCategory.subCategory)
    @Field(() => MainCategory,{nullable:true})
    mainCategory:MainCategory
}