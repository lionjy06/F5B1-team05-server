import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class Chat{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    content:string

    @CreateDateColumn()
    createdAt:Date

    @Column()
    @Field(() => String)
    sellerEmail:string

    @ManyToOne(() => User)
    @Field(() => User)
    user:User
}