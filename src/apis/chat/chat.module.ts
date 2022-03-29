// import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";
// import { Product } from "../product/entities/product.entity";
// import { User } from "../user/entities/user.entity";
// import { ChatResolver } from "./chat.resolver";
// import { ChatService } from "./chat.service";
// import { Chat } from "./entities/chat.entity";

// @Module({
//     imports:[
//         TypeOrmModule.forFeature([
//             Chat,
//             User,
//             Product
//         ])
//     ],
//     providers:[ChatResolver, ChatService]
// })
// export class ChatModule{}