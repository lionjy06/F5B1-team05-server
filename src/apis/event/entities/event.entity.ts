import { Uuid } from "@elastic/elasticsearch/lib/api/types";
import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class Event{
    @PrimaryGeneratedColumn('uuid')
    @Field(() =>String)
    id:string

    @Column()
    @Field(() => String)
    roomId:string

    @Column({default:''})
    @Field(() => String)
    chatLog:string

    @CreateDateColumn()
    createdAt:Date

    @ManyToOne(() => User)
    @Field(() => User)
    user:User 

    @ManyToOne(() =>Product)
    @Field(() => Product)
    product:Product
}