import { Field, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class AdminCategory{
    @PrimaryGeneratedColumn('uuid')
    @Field(()=>String)
    id:string

    @Column()
    @Field(() => String)
    name:string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date
}