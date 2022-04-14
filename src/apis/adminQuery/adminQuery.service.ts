import { Injectable, UnprocessableEntityException, UseGuards } from "@nestjs/common";
import { Args } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { getRepository, Repository } from "typeorm";
import { AdminCategory } from "../adminCategory/entities/adminCategory.entity";
import { User } from "../user/entities/user.entity";
import { UpdateAdminQueryInput } from "./dto/updateAdminQueryInput";
import { AdminQuery } from "./entities/adminQuery.entity";


interface IUpdate {
    currentUser:ICurrentUser,
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

    
    async create({title,contents,currentUser,img,adminCategoryId}){
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        const adminCategory = await this.adminCategoryRepository.findOne({where:{id:adminCategoryId}})
        return await this.adminQueryRepository.save({title,contents,img,user,adminCategory})
    }

    async findAll({currentUser,adminCategoryId}){
        return this.adminQueryRepository.find({where:{user:currentUser.id,adminCategory:adminCategoryId},relations:['user','adminCategory']})
    }

    async findAllUserQuries(){

        const queries = await getRepository(AdminQuery)
        .createQueryBuilder('adminQuery')
        .leftJoinAndSelect('adminQuery.adminCategory','adminCategory')
        .leftJoinAndSelect('adminQuery.user','user')
        .getMany()

        return queries
    }

    async findOne({adminQueryId,currentUser,adminCategoryId}){
        return await this.adminQueryRepository.findOne({where:{id:adminQueryId,adminCategory:adminCategoryId,user:currentUser.id},relations:['adminCategory','user']})
    }

    async delete({adminQueryId,currentUser}){

        const query = await this.adminQueryRepository.findOne({where:{id:adminQueryId},relations:['user']})
        
        if(query.user.id !== currentUser.id){
            throw new UnprocessableEntityException('당신의 문의 사항이 아니므로 삭제 할수없습니다')
        }

        const result = await this.adminQueryRepository.softDelete(query)
        return result.affected ? true:false
        
    }

    async update({adminQueryId,updateAdminQueryInput,currentUser}:IUpdate){
        
        const adminQuery = await this.adminQueryRepository.findOne({where:{id:adminQueryId},relations:['user','adminCategory']})
        if(adminQuery.user.id !== currentUser.id){
            throw new UnprocessableEntityException('당신의 문의 사항이 아니므로 수정 할수없습니다')
        }

        const newAdminQuery = {...adminQuery,...updateAdminQueryInput}
        const updatedAdminQuery = await this.adminQueryRepository.save(newAdminQuery)
        return updatedAdminQuery
    }
}