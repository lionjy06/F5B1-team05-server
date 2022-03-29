import { ConflictException } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { BrandService } from "./brand.service";
import { Brand } from "./entities/brand.entity";


@Resolver()
export class BrandResolver{
    constructor(
        private readonly brandService:BrandService
    ){}

    @Mutation(() => Brand)
    async createBrand(
        @Args('name') name:string,
        
    ){
        const brand = await this.brandService.findOne({name})
        if(brand){
            throw new ConflictException('이미 존재하는 브랜드 입니다.')
        }
        return await this.brandService.create({name})
    }
   
    @Mutation(() => Boolean)
    async deleteBrand(
        @Args('productImgId') productImgId:string
    ){
        return await this.brandService.delete({id:productImgId})
    }

    @Query(() => Brand)
    async fetchBrand(
        @Args('name') name:string
    ){
        return this.brandService.findOne({name})
    }

    @Query(() => [Brand])
    async fetchBrands(){
        return this.brandService.findAll()
    }
}