import { Field, ObjectType } from "@nestjs/graphql";
import { SubCategory } from "src/apis/subCategory/entities/subCategory.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class MainCategory{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    name:string

    @DeleteDateColumn()
    deletedAt:Date

    @OneToMany((type) => SubCategory, (subCategory) => subCategory.mainCategory)
    subCategory:SubCategory[]
}