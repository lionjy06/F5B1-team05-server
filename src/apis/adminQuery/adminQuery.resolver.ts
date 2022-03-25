import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { UserService } from "../user/user.service";

import { AdminQueryService } from "./adminQuery.service";
import { UpdateAdminQueryInput } from "./dto/updateAdminQueryInput";
import { AdminQuery } from "./entities/adminQuery.entity";


@Resolver()
export class AdminQueryResolver{
    constructor(
        private readonly adminQueryService:AdminQueryService,
        private readonly userService:UserService
    ){}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => AdminQuery)
    async createAdminQuery(
        @Args('title') title:string,
        @Args('contents') contents:string,
        @Args('img') img:string,
        @Args('adminCategoryId') adminCategoryId:string,
        @CurrentUser() currentUser:ICurrentUser
    ){
        return this.adminQueryService.create({title,contents,img,currentUser,adminCategoryId})
    }

    //이건어케하냐??(유저랑 어드민카테고리 못봄)
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [AdminQuery])
    async fetchAdminQuerys(){
        return this.adminQueryService.findAll()
    }

    //이건 성공
    @UseGuards(GqlAuthAccessGuard)
    @Query(() => AdminQuery)
    async fetchAdminQuery(
        @Args('adminQueryId') adminQueryId:string,
        @Args('adminCategoryId') adminCategoryId:string,
        @Args('userId') userId:string
    ){
        return this.adminQueryService.findOne({adminQueryId,adminCategoryId,userId})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteAdminQuery(
        @Args('adminQueryId') adminQueryId:string
    ){
        return await this.adminQueryService.delete({adminQueryId})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() =>  AdminQuery)
    async updateAdminQuery(
        @Args('adminQueryId') adminQueryId:string,
        @Args('updatedAdminQueryInput') updateAdminQueryInput: UpdateAdminQueryInput
    ){
        //cannot null for non-nullable떠서 adminCategory랑 user다시 설정해줘야됨...
        return await this.adminQueryService.update({adminQueryId,updateAdminQueryInput})
    }
}