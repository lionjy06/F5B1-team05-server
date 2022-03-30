import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class SellerInfo{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    @Field(() => Int)
    reviewNum:number

    @Column()
    @Field(()=>Int)
    ratings:number

    @Column()
    @Field(() => String)
    nickname:string

    @Column()
    @Field(()=>Int)
    productNum:number

    @Column()
    @Field(() => String)
    img:string

    @Column({nullable:true})
    @Field(() => String,{nullable:true})
    profilePic?:string

    
}