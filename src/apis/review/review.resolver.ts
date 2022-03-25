import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { getRepository } from "typeorm";
import { ProductService } from "../product/product.service";
import { SellerInfo } from "../sellerInfo/sellerInfo.entities.ts/sellerInfo.entity";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { CreateReviewInput } from "./dto/createReviewInput";
import { Review } from "./entities/review.entity";
import { ReviewService } from "./review.service";

@Resolver()
export class ReviewResolver{
    constructor(
        private readonly reviewService:ReviewService,
        private readonly userService:UserService,
        private readonly productService: ProductService
    ){}
                                                                                                                                                                                                
    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Review)
    async createReview(
        @Args('title') title:string,
        @Args('content') content:string,
        @Args('img') img:string,
        @Args('ratings') ratings:number,
        @Args('productId') productId:string,
        @CurrentUser () currentUser : ICurrentUser
        
    ){

        // const review = await getRepository(Review)
        // .createQueryBuilder('review')
        // .leftJoinAndSelect('review.product','product')
        // .leftJoinAndSelect('review.user','user')
        // .where('product.id = :id', {id:productId})
        // .andWhere('user.id = :id',{id:currentUser.id})
        // .getMany()
        // console.log('this is an review query', review)

        return await this.reviewService.create({title,content,img,ratings,productId,currentUser})
    }

    
    @Query(() => SellerInfo)
    async fetchReview(
        @Args('userId') userId:string,
    ){
        return await this.reviewService.findReview({userId })
    }
}