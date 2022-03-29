import { Field, ObjectType } from "@nestjs/graphql";
import { AdminCategory } from "src/apis/adminCategory/entities/adminCategory.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class AdminQuery{
    @PrimaryGeneratedColumn('uuid')
    @Field(() =>String)
    id:string

    @Column()
    @Field(() =>String)
    title:string

    @Column()
    @Field(() => String)
    contents:string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @ManyToOne(() => AdminCategory)
    @Field(() => AdminCategory)
    adminCategory:AdminCategory

    @ManyToOne(() => User)
    @Field(() => User)
    user:User

    @Column()
    @Field(()=>String)
    adminAnswer:string

}