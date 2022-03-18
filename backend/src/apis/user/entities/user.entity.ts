import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class User{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    nickname:string

    @Column()
    @Field(() => String)
    email:string

    @Column()
    @Field(() => String)
    profilePic:string

    @Column()
    @Field(() => String)
    coverPic:string

    @Column()
    @Field(() => String)
    password:string

    @Column()
    @Field(() => String)
    phoneNum:string

    @Column({default:0})
    @Field(() => Int)
    ratingSum:number

    @Column()
    @Field(() => String, {nullable:true})
    accountOwner?:string

    @Column()
    @Field(() => Int, {nullable:true})
    accountNum?:number

    @Column()
    @Field(() => String, {nullable:true})
    bank?:string

    @Column({default:false})
    @Field(() => Boolean)
    isAdmin:boolean

    @Column()
    @Field(() => Int,{nullable:true})
    income?:number

    @DeleteDateColumn()
    deletedAt:Date

}