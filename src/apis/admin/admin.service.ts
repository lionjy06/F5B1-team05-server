import { Injectable, UseGuards } from "@nestjs/common";
import { Args } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { getRepository, Repository } from "typeorm";
import { AdminCategory } from "../adminCategory/entities/adminCategory.entity";
import { AdminQuery } from "../adminQuery/entities/adminQuery.entity";
import { User } from "../user/entities/user.entity";
import { Admin } from "./entities/admin.entity";




@Injectable()
export class AdminService{
    constructor(
        @InjectRepository(AdminQuery)
        private readonly adminQueryRepository:Repository<AdminQuery>,

        @InjectRepository(Admin)
        private readonly adminRepository:Repository<Admin>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @InjectRepository(AdminCategory)
        private readonly adminCategoryRepository:Repository<AdminCategory>
    ){}

    
    async reply({contents,currentUser,userQueryId}){

       

        const userQuery = await this.adminQueryRepository.findOne({where:{id:userQueryId}})
        console.log('123111 this is userQUery', userQuery)
        const user = await this.userRepository.findOne({where:{id:currentUser.id},relations:['admin']})
        
        return await this.adminRepository.save({contents,userQuery, user})
    }

    async findAll({userId}){
        const admin = await getRepository(User)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.admin','admin')
        .leftJoinAndSelect('admin.userQuery','userQuery')
        .where('admin.id = :id',{id:userId})
        .getMany()

        
        return admin
    }

    async findOne({userQueryId,userId}){
        // const admin = await getRepository(Admin)
        // .createQueryBuilder('admin')
        // .leftJoinAndSelect('admin.userQuery','userQuery')
        // .leftJoinAndSelect('admin.user','user')
        // .where('userQuery.id = :id',{id:userQueryId})
        // .andWhere('user.id = :id', {id:userId})
        // .getMany()

        const admin = await this.adminRepository.findOne({
            where:{user:userId, userQuery:userQueryId},
            relations:['user','userQuery']

        })

     
        
        
        
    }

    // async delete({adminQueryId}){
    //     const result = await this.adminQueryRepository.softDelete({id:adminQueryId})
    //     return result.affected ? true:false
    // }

    // async update({adminQueryId,updateAdminQueryInput}:IUpdate){
    //     const adminQuery = await this.adminQueryRepository.findOne({where:{id:adminQueryId}})
    //     const newAdminQuery = {...adminQuery,...updateAdminQueryInput}
    //     const updatedAdminQuery = await this.adminQueryRepository.save(newAdminQuery)
    //     return updatedAdminQuery
    // }
}