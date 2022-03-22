import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { create } from "domain";
import { getRepository, Repository } from "typeorm";
import { Brand } from "../brand/entities/brand.entity";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";

import { SubCategory } from "../subCategory/entities/subCategory.entity";
import { CreateProductInput } from "./dto/createProductInput";
import { Product } from "./entities/product.entity";


export interface ICreate {
    createProductInput: CreateProductInput
}

@Injectable()
export class ProductService{
    
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>

    @InjectRepository(Brand)
    private readonly brandRepository:Repository<Brand>

    @InjectRepository(SubCategory)
    private readonly subCategoryRepository:Repository<SubCategory>
    
    @InjectRepository(MainCategory)
    private readonly mainCateogryRepository:Repository<MainCategory>

    

    async findAll(){
        return await this.productRepository.find({
            relations:["brand",'subCategory'],
        })
    } 
    
    async findOne({name}){
        return await this.productRepository.findOne({name})
    }

    async create({createProductInput}:ICreate){
        const {brandId, subCategoryId,...rest} = createProductInput


        const brand = await this.brandRepository.findOne({id:brandId})

        const subCategory = await this.subCategoryRepository.findOne({id:subCategoryId})
        
        console.log(`subca`,subCategory)
        return await this.productRepository.save({brand,subCategory,...rest})
    }

    async findProductRelateMainCategory({mainCategory}){
        // const result1 = await getConnection()
        // .createQueryBuilder()
        // .select('sub_category')
        // .from(SubCategory,'sub_category')
        // .where('sub_category.mainCategory = :id',{id:mainCategory})
        // .getMany()
        
        const result1 = await getRepository(Product)
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.subCategory','subCategory')
            .leftJoinAndSelect('subCategory.mainCategory','mainCategory')
            .where('mainCategory.id = :id', {id:mainCategory})
            .getMany()

        console.log('123123',result1)
        // const result = await this.subCategoryRepository.findOne({where:{mainCategory:mainCategory},relations:["mainCategory"]})
        
       
        return result1
    }
}