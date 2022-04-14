import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getConnection, getRepository, Repository } from "typeorm";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";
import { Product } from "../product/entities/product.entity";
import { SubCategory } from "./entities/subCategory.entity";


@Injectable()
export class SubCategoryService{
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository:Repository<SubCategory>

    

    async create({name,category}){
     
        return await this.subCategoryRepository.save({name,mainCategory:category})
    }

    async delete({subCategoryId}){
        const result = await this.subCategoryRepository.softDelete({id:subCategoryId})
        return result.affected ? true: false
    }

    async findAll(){
        return await this.subCategoryRepository.find()
    }

    async findOne({mainCategoryId}){
      
        
        const result = await this.subCategoryRepository.findOne({where:{mainCategory:mainCategoryId},relations:["mainCategory"]})
        
       
        return result
    }


}