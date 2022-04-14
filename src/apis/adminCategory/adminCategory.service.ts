import { ConflictException, Injectable } from "@nestjs/common";
import { Args } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { create } from "domain";

import { Repository } from "typeorm";
import { AdminCategory } from "./entities/adminCategory.entity";


@Injectable()
export class AdminCategoryService{
    constructor(
        @InjectRepository(AdminCategory)
        private readonly adminCategoryRepository:Repository<AdminCategory>
    ){}
    async create({name}){
        const checkName = await this.adminCategoryRepository.findOne({where:{name}})

        if(checkName){
            throw new ConflictException('이미 존재하는 문의 타입입니다.')
        }
        return await this.adminCategoryRepository.save({name})
    }

    async delete({adminCategoryId}){
        const result = await this.adminCategoryRepository.delete({id:adminCategoryId})
        return result.affected ? true:false
    }
//
    async findAll(){
        return await this.adminCategoryRepository.find()
    }
}