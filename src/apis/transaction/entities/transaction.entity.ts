import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum TRANSACTION_STATUS_ENUM {
   
    PAYMENT = 'PAYMENT',
    EXAMINATION = 'EXAMINATION',
    ONTHEWAY = 'ONTHEWAY',
    DELIVERED = 'DELIVERED',
    CANCEL = 'CANCEL', 
  }
   
  registerEnumType(TRANSACTION_STATUS_ENUM, {
    name: 'TRANSACTION_STATUS_ENUM',
  });

@Entity()
@ObjectType()
export class Transaction{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    impUid:string 

    @Column({ type: 'enum', enum: TRANSACTION_STATUS_ENUM })
    @Field(() => TRANSACTION_STATUS_ENUM)
    status: TRANSACTION_STATUS_ENUM;

    @Column()
    @Field(() => Int)
    amount:number

    @CreateDateColumn()
    @Field(()=>Date)
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @ManyToOne(() => Product)
    @Field(() => Product)
    product:Product

    @ManyToOne(() => User)
    @Field(() => User)
    user:User
}

