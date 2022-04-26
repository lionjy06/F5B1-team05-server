import { Field } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


export class Chat{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    chatLog:string

    @ManyToOne(() => User)
    @Field(() => User)
    user:User 

    @ManyToOne(() => Event)
    @Field(() => Event)
    event:Event

    @CreateDateColumn()
    createdAt:Date
}