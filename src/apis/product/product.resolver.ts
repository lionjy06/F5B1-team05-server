
import { Resolver,Query  } from "@nestjs/graphql";

@Resolver()
export class ProductResolver{
    @Query(() => String)
    getHello(){
        return 'hi'
    }
}