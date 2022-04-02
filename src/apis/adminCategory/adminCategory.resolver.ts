import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { RolesGuard } from "src/common/auth/gql-role.guard";
import { Roles } from "src/common/auth/gql-role.param";
import { Role } from "../user/entities/user.entity";
import { AdminCategoryService } from "./adminCategory.service";
import { AdminCategory } from "./entities/adminCategory.entity";


@Resolver()
export class AdminCategoryResolver{
    constructor(
        private readonly adminCategoryService:AdminCategoryService
    ){}

    @Roles(Role.ADMIN)
    @UseGuards(GqlAuthAccessGuard, RolesGuard)
    @Mutation(() => AdminCategory)
    async createAdminCategory(
        @Args('name') name:string
    ){
        
        return await this.adminCategoryService.create({name})
    }

    @Roles(Role.ADMIN)
    @UseGuards(GqlAuthAccessGuard, RolesGuard)
    @Mutation(() => Boolean)
    async deleteAdminCategory(
        @Args('adminCategoryId') adminCategoryId:string
    ){
        return await this.adminCategoryService.delete({adminCategoryId})
    }

    @Roles(Role.ADMIN)
    @UseGuards(GqlAuthAccessGuard, RolesGuard)
    @Query(() => [AdminCategory])
    async fetchAdminCategorys(){
        return await this.adminCategoryService.findAll()
    }
}