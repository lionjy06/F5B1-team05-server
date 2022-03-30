import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/apis/user/entities/user.entity";
import { Column, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class UserAddr{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String)
    address:string

    @Column()
    @Field(() => String)
    addressDetail:string

    @Column()
    @Field(() => String)
    zipCode:string

    @DeleteDateColumn()
    deletedAt:Date

    @ManyToOne(() => User)
    @Field(()=>User)
    user:User
}