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

       

        const userQuery = await this.adminQueryRepository.findOne({where:{id:userQueryId},relations:['user']})
        console.log('123111 this is userQUery', userQuery)
        const user = await this.userRepository.findOne({where:{id:currentUser.id},relations:['admin']})
        
        return await this.adminRepository.save({contents,userQuery, user})
    }

    async findAll({currentUser}){
        const admin = await getRepository(Admin)
        .createQueryBuilder('admin')
        .leftJoinAndSelect('admin.userQuery','userQuery')
        .leftJoinAndSelect('userQuery.user','user')
        .where('user.id = :id',{id:currentUser.id})
        .getMany()

        console.log('this is admin',admin)
        return admin
    }

    async findOne({adminId,userQueryId,currentUser}){
        const admin = await getRepository(Admin)
        .createQueryBuilder('admin')
        .leftJoinAndSelect('admin.user','adminUser')
        .leftJoinAndSelect('admin.userQuery','userQuery')
        .leftJoinAndSelect('userQuery.user','user')
        .where('admin.user = :user',{user:currentUser.id})
        .andWhere('userQuery.id = :id', {id:userQueryId})
        .getOne()

       

        console.log('this is admin',admin)
     
        
        
        return admin
    }

    async delete({adminId}){
        const result = await this.adminRepository.softDelete({id:adminId})
        return result.affected ? true:false
    }
}