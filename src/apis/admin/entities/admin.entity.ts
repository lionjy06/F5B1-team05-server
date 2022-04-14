import { Field, ObjectType } from "@nestjs/graphql";
import { AdminQuery } from "src/apis/adminQuery/entities/adminQuery.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
@ObjectType()
export class Admin{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() =>String)
    contents:string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date
 
    @ManyToOne(() => AdminQuery , (userquery) => userquery.admin)
    @Field(() => AdminQuery)
    userQuery:AdminQuery

  
    @ManyToOne((type) => User, user => user.admin)
    @Field(() =>User)
    user:User

}