import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UpdateUserAddrInput {
    

    @Field(() => String)
    address:string

    @Field(() => String)
    addressDetail:string

    @Field(() => String)
    zipCode:string
}