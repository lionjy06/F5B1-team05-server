// import { UseGuards } from "@nestjs/common";
// import { Args, Mutation, Resolver } from "@nestjs/graphql";
// import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
// import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
// import { ProductService } from "../product/product.service";
// import { UserService } from "../user/user.service";
// import { ChatService } from "./chat.service";
// import { Chat } from "./entities/chat.entity";

// @Resolver()
// export class ChatResolver{
//     constructor(
//         private readonly chatService:ChatService,
        
//     ){}
//         @UseGuards(GqlAuthAccessGuard)
//         @Mutation(() => Chat)
//         async createChat(
//             @Args('content') content:string,
//             @Args('productId') productId:string,
//             @CurrentUser() currentUser:ICurrentUser
//         ){
            
//             return await this.chatService.create({content,productId,currentUser})
//         }
    
// }