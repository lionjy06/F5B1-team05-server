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

    async findSellerProduct({userId}){
        
        return await this.productRepository.find({relations:['user']})
    }

    async findAll(){
        // const subCategory= await this.productRepository.find({
        //     relations:['subCategory','subCategory.mainCategory','brand']
        // })
        
        return await getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.subCategory','subCategory')
        .leftJoinAndSelect('product.brand','brand')
        .leftJoinAndSelect('product.user','user')
        .leftJoinAndSelect('subCategory.mainCategory','mainCategory')
        .orderBy('product.createdAt','DESC')
        .getMany()

        // return subCategory
    } 
    
    async findOne({productId}){

        const subCategory = await getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.subCategory','subCategory')
        .leftJoinAndSelect('product.brand','brand')
        .leftJoinAndSelect('product.user','user')
        .leftJoinAndSelect('subCategory.mainCategory','mainCategory')
        .where('product.id = :id',{id:productId})
        .orderBy('product.createdAt','ASC')
        .getOne()
        
        return await subCategory
        //
    }

    
    async create({currentUser,createProductInput}:ICreate){
       
        const {brandName, subCategoryName,...rest} = createProductInput


        // const brand = await this.brandRepository.findOne({id:brandId})
        const brand = await this.brandRepository.findOne({where:{name:brandName}})
        const subCategory = await this.subCategoryRepository.findOne({where:{name:subCategoryName},relations:[
            'mainCategory'
        ]})
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        return await this.productRepository.save({...rest,brand,subCategory,user,})
    }

    async findProductRelateMainCategory({name}){
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
            .where('mainCategory.name = :name', {name})
            .orderBy('product.createdAt','ASC')
            .getMany()

        console.log('123123',result1)
        // const result = await this.subCategoryRepository.findOne({where:{mainCategory:mainCategory},relations:["mainCategory"]})
        
       
        return result1
    }

    
    async fetchAllProduct(){
        const product = await getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.brand','brand')
        .leftJoinAndSelect('product.subCategory','subCategory')
        .leftJoinAndSelect('product.user','user')
        .leftJoinAndSelect('subCategory.mainCategory','mainCategory')
        .getMany()

        return product

    }


    async update({productId,updateProductInput}:IUdate){
        const product = await this.productRepository.findOne({id:productId})
        const newProduct = {...product, ...updateProductInput};
        const updatedProduct = await this.productRepository.save(newProduct)
        return updatedProduct;
    }

    async delete({productId}){
        const result = await this.productRepository.delete({id:productId})
        return result.affected ? true: false
    }
}