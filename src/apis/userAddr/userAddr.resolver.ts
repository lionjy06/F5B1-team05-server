import {  UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { CreateUserAddrInput } from "./dto/createUserAddr.input";
import { UpdateUserAddrInput } from "./dto/updateUserAddr.input";
import { UserAddr } from "./entities/userAddr.entity";
import { UserAddrService } from "./userAddr.service";


@Resolver()
export class UserAddrResolver{
    constructor(
        private readonly userAddrService:UserAddrService
    ){}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => UserAddr)
    async createUserAddr(
        @Args('createUserAddrInput') createUserAddrInput:CreateUserAddrInput,
        @CurrentUser() currentUser:ICurrentUser
    ){
        return await this.userAddrService.create({createUserAddrInput,currentUser})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => UserAddr)
    async updateUserAddr(
        @CurrentUser() currenUser:ICurrentUser,
        @Args('updateUserAddrInput') updateUserAddrInput:UpdateUserAddrInput,
    ){
        return await this.userAddrService.update({currenUser,updateUserAddrInput}) 
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteUserAddr(
        @CurrentUser() currenUser:ICurrentUser
    ){
        return await this.userAddrService.delete({currenUser})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => UserAddr)
    async fetchUserAddr(
        @CurrentUser() currentUser:ICurrentUser,
        @Args('userAddrId') userAddrId:string
    ){
        return await this.userAddrService.fetchUserAddr({currentUser,userAddrId})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(()=>[UserAddr])
    async fetchUserAddrs(
        @CurrentUser() currentUser:ICurrentUser,
    ){
        return await this.userAddrService.fetchUserAddrs({currentUser})
    }
}