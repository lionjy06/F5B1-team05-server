import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum ORDER_STATUS_ENUM {
  // 결재완료, 검수중, 배송중, 배송완료, 취소 
    PAYMENT = 'PAYMENT',
    EXAMINATION = 'EXAMINATION',
    ONTHEWAY = 'ONTHEWAY',
    DELIVERED = 'DELIVERED',
    CANCEL = 'CANCEL', 
  }
   
  registerEnumType(ORDER_STATUS_ENUM, {
    name: 'ORDER_STATUS_ENUM',
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

    @Column({ type: 'enum', enum: ORDER_STATUS_ENUM })
    @Field(() => ORDER_STATUS_ENUM)
    status: ORDER_STATUS_ENUM;
 
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

