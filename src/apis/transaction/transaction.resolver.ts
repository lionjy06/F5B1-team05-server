import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { error } from "console";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { IamportService } from "../import/import.service";
import { Transaction } from "./entities/transaction.entity";
import { TransactionService } from "./transaction.service";


@Resolver()
export class TransactionResovler{
    constructor(
        private readonly transactionService:TransactionService,
        private readonly importService:IamportService

    ){}

        @Query(() => Transaction)
        async fetchimpuidwithproductiduserid(
            @Args('productid') productid:string,
        ){
            return this.transactionService.fetchimpuidwithproductiduserid({productid})
        }

        @UseGuards(GqlAuthAccessGuard) // 로그인 한 사람만 이 API에 접근가능함
        @Mutation(() => Transaction)
        async createtransaction(
            @Args('impuid') impuid:string,
            @Args('amount') amount:number,
            @CurrentUser() currentUser: ICurrentUser,
            ){
                try{
                    const getToken = await this.importService.getToken({impUid:impuid})
                }catch{
                    throw new error
                }
            

                return await this.transactionService.createTransaction({impuid,amount,currentUser})
        } 

        @UseGuards(GqlAuthAccessGuard) // 로그인 한 사람만 이 API에 접근가능함
        @Mutation(() => Transaction)
        async cancletransaction(
            @Args('impuid') impUid:string,
            @CurrentUser() currentUser: ICurrentUser,
        ){
            return this.importService.cancle({impUid})
        }


        @Mutation(() => Transaction)
        async updatetransaction(
            @Args('impuid') impUid:string,
            @Args('statusCode') statusCode:string,
        ){
            return await this.importService.update({impUid,statusCode})
        }


}