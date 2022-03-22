
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { ProductImg } from "./entities/productImg.entity";
import { ProductImgService } from "./productImg.service";

@Resolver()
export class ProductImgResolver{
    constructor(
        private readonly productImgService:ProductImgService,
        private readonly productService:ProductImgService
    ){}

    @Mutation(() => ProductImg)
    async createImgs(
        @Args('urls') urls:string,
        
    ){
        
        return await this.productImgService.create({urls})
    }

    @Query(()=>String)
    async fetchImg(
        @Args('productImgId') productImgId:string,
        
    ){
        
        return await this.productImgService.findOne({id:productImgId})
    }

}