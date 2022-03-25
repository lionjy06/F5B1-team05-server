import { Field, InputType, Int, PickType } from "@nestjs/graphql";
import { Product } from "../entities/product.entity";


@InputType()
export class UpdateProductInput{
    @Field(() => String)
    name:string

    @Field(() => String)
    description:string

    @Field(() => Int)
    price:number

    @Field(() => String)
    urls:string

    @Field(() => String)
    brandId:string

    @Field(() => String)
    subCategoryId:string
}