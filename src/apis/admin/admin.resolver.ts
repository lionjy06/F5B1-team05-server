import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { RolesGuard } from "src/common/auth/gql-role.guard";
import { Roles } from "src/common/auth/gql-role.param";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { UpdateAdminQueryInput } from "../adminQuery/dto/updateAdminQueryInput";
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

@Roles(Role.ADMIN)
@UseGuards(GqlAuthAccessGuard, RolesGuard)
@Query(() => [Admin])
async fetchAdminQuerys(
    @CurrentUser() currentUser:ICurrentUser,
){
    return this.adminService.findAll({currentUser})
}


@Roles(Role.ADMIN)
@UseGuards(GqlAuthAccessGuard,RolesGuard)
@Query(() => Admin)
async fetchAdminQuery(
    @Args('userQueryId') userQueryId:string,
    @CurrentUser() currentUser:ICurrentUser,
    @Args('adminId') adminId:string,
    
){
    return this.adminService.findOne({adminId,userQueryId,currentUser})
}

@Roles(Role.ADMIN)
@UseGuards(GqlAuthAccessGuard, RolesGuard)
@Mutation(() => Boolean)
async deleteAdminQuery(
    @Args('adminId') adminId:string
){
    return await this.adminService.delete({adminId})
}

}

