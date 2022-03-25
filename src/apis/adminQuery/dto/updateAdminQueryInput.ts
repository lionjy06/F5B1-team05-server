import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class UpdateAdminQueryInput{
    @Field(() => String)
    title:string

    @Field(() => String)
    contents:string

    @Field(() => String)
    adminCateogryId:string

    @Field(() => String)
    userId:string
}