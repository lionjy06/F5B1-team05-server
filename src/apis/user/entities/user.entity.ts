import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class User{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(()=>String,{nullable:true})
    nickname?:string

    @Column()
    @Field(()=>String)
    name:string


    @Column()
    @Field(()=>String)
    email:string

    @Column({nullable:true})
    @Field(()=>String,{nullable:true})
    profilePic?:string

    @Column({nullable:true})
    @Field(()=>String,{nullable:true})
    coverPic?:string

    @Column()
    @Field(()=>String)
    password:string

    @Column()
    @Field(()=>String)
    phoneNum:string

    @Column({default:0})
    @Field(()=>Int)
    ratingAvg:number

    @Column({nullable:true})
    @Field(()=>String,{nullable:true})
    accountOwner?:string

    @Column({nullable:true})
    @Field(()=>Int,{nullable:true})
    accountNumber?:number

    @Column({nullable:true})
    @Field(()=>String,{nullable:true})
    bank?:string

    @Column({nullable:true})
    @Field(()=>Int,{nullable:true})
    income?:number

    // 나중에 롤가드 하면서 구현하겠음
    // @Column()
    // @Field(() => Enum)
    // role:enum

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date
}