
import { Resolver,Query, Mutation, Args  } from "@nestjs/graphql";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";

import { CreateProductInput } from "./dto/createProductInput";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";


//recentOrder.user.id

@Resolver()
export class ProductResolver{
    constructor(
        private readonly productSerivce:ProductService,
        
    ){}

    @Query(() => [Product])
    async fetchProducts(){
        return await this.productSerivce.findAll()
    }

    @Query(() => Product)
    async fetchProduct(
        @Args('name') name:string
    ){
        return await this.productSerivce.findOne({name})
    }

    @Mutation(() => Product)
    async createProduct(
        
        @Args('createProductInput')createProductInput:CreateProductInput,
       
    ){
        return await this.productSerivce.create({createProductInput})
    }
    @Query(() => [Product])
    async fetchProductRelateMainCategory(
        @Args('mainCategory') mainCategory:string
    ){
        return await this.productSerivce.findProductRelateMainCategory({mainCategory})
    }
}