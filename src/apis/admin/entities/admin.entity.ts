import { Field, ObjectType } from "@nestjs/graphql";
import { User } from "src/apis/user/entities/user.entity";
import { Column, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
@ObjectType()
export class Admin{
    @PrimaryGeneratedColumn('uuid')
    @Field(() => String)
    id:string

    @Column()
    @Field(() => String,{nullable:true})
    query?:string

    @DeleteDateColumn()
    deletedAt:Date

    @JoinColumn()
    @OneToOne(() => User)
    @Field(() => User)
    user:User

    
}