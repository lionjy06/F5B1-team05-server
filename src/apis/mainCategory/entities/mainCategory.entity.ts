import { Field, ObjectType } from "@nestjs/graphql";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


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

    
}