import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Brand } from "src/apis/brand/entities/brand.entity";
import { Review } from "src/apis/review/entities/review.entity";
import { SubCategory } from "src/apis/subCategory/entities/subCategory.entity";
import { User } from "src/apis/user/entities/user.entity";

import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


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
    views:number

    @Column({default:0})
    @Field(() => Int)
    likes:number

    @Column({nullable:true})
    @Field(() => String,{nullable:true})
    urls?: string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @ManyToOne(() => Brand,{cascade:true, onDelete: 'CASCADE' })
    @Field(() => Brand)
    brand:Brand


    @ManyToOne(() => SubCategory, (subCategory) => subCategory.product)
    @Field(() => SubCategory)
    subCategory:SubCategory

    @ManyToOne(() => User,{cascade:true, onDelete: 'CASCADE' })
    @Field(() => User)
    user:User
}