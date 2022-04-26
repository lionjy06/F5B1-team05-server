import { Uuid } from "@elastic/elasticsearch/lib/api/types";
import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";

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

    @ManyToOne(() => Product)
    @Field(() => Product)
    product:Product

    @CreateDateColumn()
    createdAt:Date

 
}