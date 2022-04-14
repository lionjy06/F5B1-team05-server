import {  UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { RolesGuard } from "src/common/auth/gql-role.guard";
import { Roles } from "src/common/auth/gql-role.param";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { Role } from "../user/entities/user.entity";
import { Review } from "./entities/review.entity";
import { ReviewService } from "./review.service";

@Resolver()
export class ReviewResolver{
    constructor(
        private readonly reviewService:ReviewService
    ){}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Review)
    async createReview(
        @CurrentUser() currentUser:ICurrentUser,
        @Args('content') content: string,
        @Args('ratings') ratings:number,
        @Args('productId') productId:string,
        @Args('img') img:string,
    ){
        return await this.reviewService.createReview({currentUser,content, ratings, productId,img})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Review])
    async fetchReview(
        @CurrentUser() currentUser:ICurrentUser
    ){
        return await this.reviewService.fetchReview({currentUser})
    }

    @Roles(Role.ADMIN, Role.USER)
    @UseGuards(GqlAuthAccessGuard,RolesGuard)
    @Mutation(() => Boolean)
    async deleteReview(
        
        @Args('reviewId') reviewId:string
    ){
        return await this.reviewService.deleteReview({reviewId})
    }
}