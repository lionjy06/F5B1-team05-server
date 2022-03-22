
import { ConflictException } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { MainCategory } from "./entities/mainCategory.entity";
import { MainCategoryService } from "./mainCateory.service";


@Resolver()
export class MainCategoryResolver{
    constructor(
        private readonly mainCategoryService:MainCategoryService
    ){}
    @Mutation(() => MainCategory)
    async createMainCategory(
        @Args('name') name:string
    ){  
        const category = await this.mainCategoryService.findOne({name})
        if(category){
            throw new ConflictException('이미 존재하는 카테고리 입니다.')
        }
        return await this.mainCategoryService.create({name})
    }

    @Mutation(() => Boolean)
    async deleteMainCategory(
        @Args('mainCategoryId') mainCategoryId:string
    ){
        return await this.mainCategoryService.delete({mainCategoryId})
    }
    @Query(() => MainCategory)
    async fetchMainCategory(
        @Args('name') name:string
        ){
        return this.mainCategoryService.findOne({name})
    }
    @Query(()=>[MainCategory])
    async fetchMainCategorys(){
        return this.mainCategoryService.findAll()
    }
}