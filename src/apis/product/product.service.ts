import { Injectable, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { create } from "domain";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { ICurrentUser } from "src/common/auth/gql-user.param";
import { getRepository, Repository } from "typeorm";
import { Brand } from "../brand/entities/brand.entity";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";

import { SubCategory } from "../subCategory/entities/subCategory.entity";
import { User } from "../user/entities/user.entity";
import { CreateProductInput } from "./dto/createProductInput";
import { UpdateProductInput } from "./dto/updateProductIntput";
import { Product } from "./entities/product.entity";


interface IUdate{
    productId:string
    updateProductInput: UpdateProductInput
}

export interface ICreate {
    createProductInput: CreateProductInput
    currentUser:ICurrentUser
}

@Injectable()
export class ProductService{
    constructor(
        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,
    
        @InjectRepository(Brand)
        private readonly brandRepository:Repository<Brand>,
    
        @InjectRepository(SubCategory)
        private readonly subCategoryRepository:Repository<SubCategory>,
        
        @InjectRepository(MainCategory)
        private readonly mainCateogryRepository:Repository<MainCategory>,
    
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    

    async findAll(){
        return await this.productRepository.find({
            relations:["brand",'subCategory'],
        })
    } 
    
    async findOne({productId,userId,subCategoryId}){
        
        return await this.productRepository.findOne({where:{id:productId,user:userId,subCategory:subCategoryId},relations:['user','subCategory']})
    }

    
    async create({currentUser,createProductInput}:ICreate){
        const {brandId, subCategoryId,...rest} = createProductInput


        // const brand = await this.brandRepository.findOne({id:brandId})
        const brand = await this.brandRepository.findOne({where:{id:brandId}})
        const subCategory = await this.subCategoryRepository.findOne({where:{id:subCategoryId}})
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        
        return await this.productRepository.save({brand,subCategory,user,...rest})
    }

    async findProductRelateMainCategory({mainCategoryId}){
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
            .where('mainCategory.id = :id', {id:mainCategoryId})
            .orderBy('product.createdAt','ASC')
            .getMany()

        console.log('123123',result1)
        // const result = await this.subCategoryRepository.findOne({where:{mainCategory:mainCategory},relations:["mainCategory"]})
        
       
        return result1
    }

    
    async update({productId,updateProductInput}:IUdate){
        const product = await this.productRepository.findOne({id:productId})
        const newProduct = {...product, ...updateProductInput};
        const updatedProduct = await this.productRepository.save(newProduct)
        return updatedProduct;
    }

    async delete({productId}){
        const result = await this.userRepository.softDelete({id:productId})
        return result.affected ? true: false
    }
}