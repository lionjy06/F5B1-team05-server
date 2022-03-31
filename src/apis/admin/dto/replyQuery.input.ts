import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class ReplyQueryInput{
    @Field(() => String)
    contents:string

    @Field(() => String)
    userQueryId:string
}