import { Injectable, UseGuards } from "@nestjs/common";
import { Args } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { Repository } from "typeorm";
import { AdminCategory } from "../adminCategory/entities/adminCategory.entity";
import { User } from "../user/entities/user.entity";
import { UpdateAdminQueryInput } from "./dto/updateAdminQueryInput";
import { AdminQuery } from "./entities/adminQuery.entity";


interface IUpdate {
    adminQueryId: string;
    updateAdminQueryInput:UpdateAdminQueryInput
  }

@Injectable()
export class AdminQueryService{
    constructor(
        @InjectRepository(AdminQuery)
        private readonly adminQueryRepository:Repository<AdminQuery>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @InjectRepository(AdminCategory)
        private readonly adminCategoryRepository:Repository<AdminCategory>
    ){}

    
    async create({title,contents,img,currentUser,adminCategoryId}){
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        const adminCategory = await this.adminCategoryRepository.findOne({where:{id:adminCategoryId}})
        return await this.adminQueryRepository.save({title,contents,img,user,adminCategory})
    }

    async findAll(){
        return this.adminQueryRepository.find()
    }

    async findOne({adminQueryId,adminCategoryId,userId}){
        return await this.adminQueryRepository.findOne({where:{id:adminQueryId,adminCategory:adminCategoryId,user:userId},relations:['adminCategory','user']})
    }

    async delete({adminQueryId}){
        const result = await this.adminQueryRepository.softDelete({id:adminQueryId})
        return result.affected ? true:false
    }

    async update({adminQueryId,updateAdminQueryInput}:IUpdate){
        const adminQuery = await this.adminQueryRepository.findOne({where:{id:adminQueryId}})
        const newAdminQuery = {...adminQuery,...updateAdminQueryInput}
        const updatedAdminQuery = await this.adminQueryRepository.save(newAdminQuery)
        return updatedAdminQuery
    }
}