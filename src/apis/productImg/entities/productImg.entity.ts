import { Field, ObjectType } from "@nestjs/graphql";
import { Product } from "src/apis/product/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class ProductImg{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(()=>String,{nullable:true})
    urls?:string

    @Column({default:false})
    @Field(()=>Boolean)
    isMain:boolean

    @ManyToOne(() => Product)
    @Field(() => Product)
    product:Product
}