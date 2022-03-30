import { Field, InputType, Int } from "@nestjs/graphql";


@InputType()
export class CreateUserAddrInput{
  
    @Field(() => String)
    address:string

    @Field(() => String)
    addressDetail:string

    @Field(() => String)
    zipCode:string
}