import { Field, Int, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Admin } from "src/apis/admin/entities/admin.entity";
import { Product } from "src/apis/product/entities/product.entity";
import { ProductLike } from "src/apis/productLike/entities/productLike.entity";
import { Review } from "src/apis/review/entities/review.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN'
}

registerEnumType(Role,{name:'Role'})

@Entity()
@ObjectType()
export class User{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string


    @Column({type:'enum', enum:Role, default: Role.USER})
    @Field(() => Role)
    role:Role

    @Column()
    @Field(()=>String)
    nickname:string

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
    password:string

    @Column()
    @Field(()=>String)
    phoneNum:string

    @Column({default:0})
    @Field(()=>Int)
    ratingAvg:number

    @Column({default:0})
    @Field(() => Int)
    ratingSum:number

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
    
    @Column({default:0})
    @Field(() => Int)
    numReview:number

    

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @OneToMany((type)=>Product,(product) => product.user)
    product:Product[]

    @OneToMany((type) => Review,(review) => review.user)
    review:Review[]

    @OneToMany((type) => ProductLike, (productLike) => productLike.user)
    productLike: ProductLike[];

    @OneToMany((type) => Admin, admin => admin.user)
    @Field(() => [Admin])
    admin:Admin[]
}    