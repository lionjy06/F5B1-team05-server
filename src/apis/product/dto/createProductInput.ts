import { Field, InputType, Int } from "@nestjs/graphql";
import { SubCategory } from "src/apis/subCategory/entities/subCategory.entity";


@InputType()
export class CreateProductInput{
    @Field(() => String)
    name:string

    @Field(() => String)
    description:string

    @Field(() => Int)
    price:number

    @Field(() => String)
    brandId:string

    @Field(() => String)
    subCategoryId:string

 
}
