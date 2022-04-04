import { Field,  ObjectType } from "@nestjs/graphql";
import { MainCategory } from "src/apis/mainCategory/entities/mainCategory.entity";
import { Product } from "src/apis/product/entities/product.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class SubCategory{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    subCategory_id:string

    @Column()
    @Field(() => String)
    name:string

    // {cascade:true, onDelete: 'CASCADE' ,eager:true}
    // 
    

    @OneToMany((type)=>Product, (product) => product.subCategory)
    product:Product[]

    @ManyToOne(() => MainCategory, (mainCategory)=>mainCategory.subCategory)
    @Field(() => MainCategory)
    mainCategory:MainCategory
}