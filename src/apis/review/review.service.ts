import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CurrentUser } from "src/common/auth/gql-user.param";
import { Repository } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Review } from "./entities/review.entity";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository:Repository<Review>,
        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,
        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async createReview({currentUser,content,img, ratings, productId}){
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        const product = await this.productRepository.findOne({where:{id:productId},relations:['user']})

        let { ratingAvg,numReview,ratingSum, ...rest } = product.user
        if(product.user.ratingAvg === null){
            const newRating = await this.userRepository.create({
                ratingSum:ratings,
                ratingAvg:ratings,
                numReview : numReview + 1,
                ...rest
            })
            const finalRating = {...product.user,...newRating}
            await this.userRepository.save(finalRating)
            
        } else {
            let reviewNum = product.user.numReview
            const newRating = await this.userRepository.create({
                ratingSum: ratingSum + ratings,
                ratingAvg: (ratingSum + ratings)/reviewNum,
                numReview: numReview + 1,
                ...rest
            })
            const finalRating = {...product.user, ...newRating}
            this.userRepository.save(finalRating)
        }

        return await this.reviewRepository.save({ratings,content,user,product,img})
    }

    async fetchReview({currentUser}){
        const user = await this.reviewRepository.find({where:{user:currentUser.id},relations:['user']})
        return user
    }

    async deleteReview({reviewId}){
        const result = await this.reviewRepository.softDelete({id:reviewId})
        return result.affected? true : false
    }
}