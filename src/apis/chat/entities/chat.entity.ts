import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum CHAT_ENUM {
      BUYER = 'BUYER',
      SELLER = 'SELLER',
      
    }
     
    registerEnumType(CHAT_ENUM, {
      name: 'CHAT_ENUM',
    });
  


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

    @Column({ type: 'enum', enum: CHAT_ENUM })
    @Field(() => CHAT_ENUM)
    sellerEmail:CHAT_ENUM

    @ManyToOne(() => User)
    @Field(() => User)
    user:User
}