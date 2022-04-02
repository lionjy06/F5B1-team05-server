import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "./entities/event.entity";




@Injectable()
export class EventService{
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository:Repository<Event>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>
        
    ){}

    async createChat({roomId,currentUser,chatLog}){
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})
        return await this.eventRepository.save({roomId,user,chatLog})
    }

    async fetchChat({roomId}){

        const room = await getRepository(Event)
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.user','user')
        .where('event.roomId = :roomId',{roomId})
        .orderBy('event.createdAt','DESC')
        .getMany()
        
        return room
    }
}