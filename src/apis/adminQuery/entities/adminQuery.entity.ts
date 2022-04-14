import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { Admin } from "src/apis/admin/entities/admin.entity";
import { AdminCategory } from "src/apis/adminCategory/entities/adminCategory.entity";
import { User } from "src/apis/user/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


export enum ANSWER_STAUS_ENUM {
    
      STANDBY = 'STANDBY',
      COMPLETE = 'COMPLETE',
      
    }
     
    registerEnumType(ANSWER_STAUS_ENUM, {
      name: 'ANSWER_STAUS_ENUM',
    });

@Entity()
@ObjectType()
export class AdminQuery{
    @PrimaryGeneratedColumn('uuid')
    @Field(() =>String)
    id:string

    @Column()
    @Field(() =>String)
    title:string

    @Column()
    @Field()
    img:string

    @Column()
    @Field(() => String)
    contents:string

    @CreateDateColumn()
    createdAt:Date

    @DeleteDateColumn()
    deletedAt:Date

    @ManyToOne(() => AdminCategory)
    @Field(() => AdminCategory)
    adminCategory:AdminCategory

    @ManyToOne(() => User)
    @Field(() => User)
    user:User

    @OneToMany(() => Admin, (admin) => admin.userQuery)
    @Field(() => [Admin])
    admin: Admin[]
}