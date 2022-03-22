import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { create } from "domain";
import { Repository } from "typeorm";
import { Brand } from "../brand/entities/brand.entity";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";
import { ProductImg } from "../productImg/entities/productImg.entity";
import { SubCategory } from "../subCategory/entities/subCategory.entity";
import { CreateProductInput } from "./dto/createProductInput";
import { Product } from "./entities/product.entity";


interface ICreate {
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

    @InjectRepository(ProductImg)
    private readonly productImgRepository:Repository<ProductImg>

    async findAll(){
        return await this.productRepository.find({
        relations:["brand",'subCategory','mainCategory','subCategory'],
        })
    } 
    
    async findOne({name}){
        return await this.productRepository.findOne({name})
    }

    async create({createProductInput}:ICreate){
        const {brandId, subCategoryId, ...rest} = createProductInput
        const brand = await this.brandRepository.findOne({id:brandId})
        const subCategory = await this.subCategoryRepository.findOne({id:subCategoryId})
        
        console.log(`subca`,subCategory)
        return await this.productRepository.save({brand,subCategory,...rest})
    }
}