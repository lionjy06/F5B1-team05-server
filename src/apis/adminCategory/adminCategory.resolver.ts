import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { AdminCategoryService } from "./adminCategory.service";
import { AdminCategory } from "./entities/adminCategory.entity";


@Resolver()
export class AdminCategoryResolver{
    constructor(
        private readonly adminCategoryService:AdminCategoryService
    ){}

    @Mutation(() => AdminCategory)
    async createAdminCategory(
        @Args('name') name:string
    ){
        
        return await this.adminCategoryService.create({name})
    }

    @Mutation(() => Boolean)
    async deleteAdminCategory(
        @Args('adminCategoryId') adminCategoryId:string
    ){
        return await this.adminCategoryService.delete({adminCategoryId})
    }
}