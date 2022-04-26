import { Injectable, UseGuards } from "@nestjs/common";
import { Mutation } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { getRepository, Repository } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Chat } from "./entities/chat.entity";
import { Event } from "./entities/event.entity";




@Injectable()
export class EventService{
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository:Repository<Event>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,

        @InjectRepository(Chat)
        private readonly chatRepository:Repository<Chat>
        
    ){}

    async fetchChat({roomId}){

        const room = await getRepository(Chat)
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user','user')
        .where('chat.roomId = :roomId',{roomId})
        .orderBy('createdAt','DESC')
        .getMany()
        
        return room
    }

    async createChat({productId,currentUser}){
        const product = await this.productRepository.findOne({where:{id:productId},relations:['user']})
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        
        const token = String(Math.floor(Math.random()*(10**6))).padStart(6,'0')

        const roomId = token + user.email

        return await this.eventRepository.save({roomId,product})

    }

    async updateChat({roomId,currentUser,updateChat}){
        const chat = await this.chatRepository.findOne({where:{roomId},relations:['user']})
        const user = await this.userRepository.findOne({id:currentUser.id})
        const chatLog = `${user.id}:${updateChat}`
        return await this.chatRepository.save({roomId,user,chatLog})
    }

    async joinSeller({currentUser}){
       
        const room = await getRepository(Chat)
        .createQueryBuilder('chat')
        .leftJoinAndSelect('chat.user','user')
        .leftJoinAndSelect('event.product','product')
        .leftJoinAndSelect('product.user','seller')
        .where('seller.id = :id',{id:currentUser.id})
        .getMany()

        return room
    }
}