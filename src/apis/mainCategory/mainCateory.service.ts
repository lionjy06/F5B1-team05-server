import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { MainCategory } from "./entities/mainCategory.entity";
//

@Injectable()
export class MainCategoryService{
    @InjectRepository(MainCategory)
    private readonly mainCategoryRepository:Repository<MainCategory>

    async create({name}){
        return await this.mainCategoryRepository.save({name})
    }

    async delete({mainCategoryId}){
        const result = await this.mainCategoryRepository.softDelete({id:mainCategoryId})
        return result.affected ? true: false
    }

    async findAll(){
        return await this.mainCategoryRepository.find()
    }

    async findOne({name}){
        const result = await this.mainCategoryRepository.findOne({name})
        return result
    }

    async findById({id:mainCategoryId}){
        return this.mainCategoryRepository.findOne({id:mainCategoryId})
    }

   
}