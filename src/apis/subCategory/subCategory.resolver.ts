
import { ConflictException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { GqlAuthRefreshGuard } from "src/common/auth/gql-auth.guard";
import { getConnection, getRepository } from "typeorm";
import { MainCategoryService } from "../mainCategory/mainCateory.service";
import { SubCategory } from "./entities/subCategory.entity";
import { SubCategoryService } from "./subCategory.service";


@Resolver()
export class SubCategoryResolver{
    constructor(
        private readonly subCategoryService:SubCategoryService,
        private readonly mainCategoryService:MainCategoryService
       
    ){}
    @Mutation(() => SubCategory)
    async createSubCategory(
        @Args('name') name:string, 
        @Args('mainCategoryId') mainCategoryId:string
        
    ){ 
        const category = await this.mainCategoryService.findById({id:mainCategoryId})
        // if(category){
        //     throw new ConflictException('이미 존재하는 카테고리 입니다.')
        // }
        return await this.subCategoryService.create({name,category})
    }

    @UseGuards(GqlAuthRefreshGuard)
    @Mutation(() => Boolean)
    async deleteSubCategory(
        @Args('SubCategoryId') subCategoryId:string
    ){
        return await this.subCategoryService.delete({subCategoryId})
    }
    @Query(() => SubCategory)
    async fetchSubCategory(
        @Args('mainCategoryId') mainCategoryId:string
        ){
        return this.subCategoryService.findOne({mainCategoryId})
    }
    @Query(()=>[SubCategory])
    async fetchSubCategorys(){
        return this.subCategoryService.findAll()
    }
}