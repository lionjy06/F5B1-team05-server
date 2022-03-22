
import { Resolver,Query, Mutation, Args  } from "@nestjs/graphql";
import { CreateProductInput } from "./dto/createProductInput";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";




@Resolver()
export class ProductResolver{
    constructor(
        private readonly productSerivce:ProductService
    ){}

    @Mutation(() => Product)
    async createProduct(
       @Args('createProductInput')createProductInput:CreateProductInput
    ){
        
        return await this.productSerivce.create({createProductInput})
    }
}