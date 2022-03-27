import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum PAYMENT_STATUS_ENUM {
    PAYMENT = 'PAYMENT',
    CANCEL = 'CANCEL',
  }
  

  registerEnumType(PAYMENT_STATUS_ENUM, {
    name: 'PAYMENT_STATUS_ENUM',
  });

@Entity()
@ObjectType()
export class Order{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    impUid:string

    @Column()
    @Field(() => Int,{nullable:true})
    price?:number

    @Column({ type: 'enum', enum: PAYMENT_STATUS_ENUM })
    @Field(() => PAYMENT_STATUS_ENUM)
    status: PAYMENT_STATUS_ENUM;

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deltedAt:Date

    @ManyToOne(() => Product)
    @Field(() => Product)
    product:Product

    @ManyToOne(() => User)
    @Field(() => User)
    user:User
}

