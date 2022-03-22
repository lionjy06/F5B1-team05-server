import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";
import { SubCategory } from "./entities/subCategory.entity";


@Injectable()
export class SubCategoryService{
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository:Repository<SubCategory>

    

    async create({name}){
        return await this.subCategoryRepository.save({name})
    }

    async delete({subCategoryId}){
        const result = await this.subCategoryRepository.softDelete({id:subCategoryId})
        return result.affected ? true: false
    }

    async findAll(){
        return await this.subCategoryRepository.find()
    }

    async findOne({name}){
        const result = await this.subCategoryRepository.findOne({name})
        return result
    }
}