import { Field, InputType, Int } from "@nestjs/graphql";


@InputType()
export class UpdateUserAccountInput{
    @Field(() => String)
    bank:string

    @Field(() => Int)
    accountNumber:number

    @Field(() => String)
    accountOwner:string
}