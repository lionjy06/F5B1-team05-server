import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { Product } from "../product/entities/product.entity";
import { ProductLike } from "./entities/productLike.entity";
import { ProductLikeService } from "./productLike.service";


@Resolver()
export class ProductLikeResolver{
    constructor(
        private readonly productLikeService:ProductLikeService,
    ){}

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => ProductLike)
    async createLike(
        @Args('productId') productId:string,
        @CurrentUser() currentUser:ICurrentUser
    ){
        return this.productLikeService.like({productId,currentUser})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Product])
    async fetchProductLike(
        @CurrentUser() currentUser:ICurrentUser
    ){
        return this.productLikeService.findProductLike({currentUser})
    }
}