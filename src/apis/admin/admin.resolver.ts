import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { RolesGuard } from "src/common/auth/gql-role.guard";
import { Roles } from "src/common/auth/gql-role.param";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { Role } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { AdminService } from "./admin.service";


import { Admin } from "./entities/admin.entity";


@Resolver()
export class AdminResolver{
    constructor(
        private readonly adminService:AdminService
    ){}

    @Roles(Role.ADMIN)
    @UseGuards(GqlAuthAccessGuard,RolesGuard)
    @Mutation(() => Admin)
    async replyAdminQuery(
    @Args('contents') contents:string,
    @CurrentUser() currentUser:ICurrentUser,
    @Args('userQueryId') userQueryId:string
){
    return await this.adminService.reply({contents,currentUser,userQueryId})
}
//이건어케하냐??(유저랑 어드민카테고리 못봄)
@Roles(Role.ADMIN)
@UseGuards(GqlAuthAccessGuard, RolesGuard)
@Query(() => [Admin])
async fetchAdminQuerys(
    @Args('userId') userId:string
){
    return this.adminService.findAll({userId})
}

// //이건 성공
@Roles(Role.ADMIN)
@UseGuards(GqlAuthAccessGuard,RolesGuard)
@Query(() => Admin)
async fetchAdminQuery(
    @Args('userQueryId') userQueryId:string,
    @Args('userId') userId:string
    
){
    return this.adminService.findOne({userQueryId,userId})
}

// @Roles(Role.ADMIN)
// @UseGuards(GqlAuthAccessGuard, RolesGuard)
// @Mutation(() => Boolean)
// async deleteAdminQuery(
//     @Args('adminQueryId') adminQueryId:string
// ){
//     return await this.adminService.delete({adminQueryId})
// }


// @UseGuards(GqlAuthAccessGuard)
// @Mutation(() =>  Admin)
// async updateAdminQuery(
//     @Args('adminQueryId') adminQueryId:string,
//     @Args('updatedAdminQueryInput') updateAdminQueryInput: UpdateAdminQueryInput
// ){
//     //cannot null for non-nullable떠서 adminCategory랑 user다시 설정해줘야됨...
//     return await this.adminService.update({adminQueryId,updateAdminQueryInput})
// }
}

