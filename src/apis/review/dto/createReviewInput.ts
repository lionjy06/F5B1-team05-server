import { Field, InputType, Int } from "@nestjs/graphql";
import { Review } from "../entities/review.entity";


@InputType()
export class CreateReviewInput{
    @Field(() => Int)
    reviewNum:number

    @Field(() => Int)
    ratings:number

    @Field(() => String,{nullable:true})
    nickname:string

    @Field(() => Int)
    productNum:number

    @Field(() => String)
    img:string

    @Field(() => String)
    profilePic:string
}