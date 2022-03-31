import { Field, InputType } from "@nestjs/graphql";


@InputType()
export class UpdateUserInfo{
    @Field(() => String)
    nickname:string

    @Field(() =>String)
    password:string
}