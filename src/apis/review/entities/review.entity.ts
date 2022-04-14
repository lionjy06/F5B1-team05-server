import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

type ratings = 0 | 1 | 2 | 3 | 4 | 5  

@Entity()
@ObjectType()
export class Review{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    content:string

    @Column({nullable:true})
    @Field(() => String,{nullable:true})
    img?:string

    @Column()
    @Field(() => Int)
    ratings:number

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @ManyToOne(() => User)
    @Field(() => User)
    user:User

    
    @ManyToOne(() => Product)
    @Field(() => Product)
    product:Product
}