import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Chat } from "./entities/chat.entity";

@Injectable()
export class ChatService{
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository:Repository<Chat>,
        
        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async create({productId, currentUser,content}){
        const sellerEmail = await this.productRepository.findOne({where:{id:productId},relations:['user']})
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        return await this.chatRepository.save({sellerEmail:sellerEmail.user.email,user,content})
    }
}