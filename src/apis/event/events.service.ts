import { Injectable, UseGuards } from "@nestjs/common";
import { Mutation } from "@nestjs/graphql";
import { InjectRepository } from "@nestjs/typeorm";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { getRepository, Repository } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Event } from "./entities/event.entity";




@Injectable()
export class EventService{
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository:Repository<Event>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>
        
    ){}

    // async createChat({currentUser,chatLog}){
    //     const user = await this.userRepository.findOne({where:{id:currentUser.id}})
    //     return await this.eventRepository.save({user,chatLog})
    // }

    async fetchChat({roomId}){

        const room = await getRepository(Event)
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.user','user')
        .where('event.roomId = :roomId',{roomId})
        .orderBy('event.createdAt','DESC')
        .getMany()
        
        return room
    }

    async createChat({productId,currentUser}){
        const product = await this.productRepository.findOne({where:{id:productId},relations:['user']})
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})

        const token = String(Math.floor(Math.random()*(10**6))).padStart(6,'0')

        const roomId = token + user.email

        return await this.eventRepository.save({roomId,product,user})

    }

    async updateChat({roomId,currentUser,updateChat}){
        const event = await this.eventRepository.findOne({where:{roomId:roomId}})
        const chatLog = `${event.chatLog}${currentUser.id}:${updateChat}\n`
        return await this.eventRepository.save({...event,chatLog})
    }
}