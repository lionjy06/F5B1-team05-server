import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Event } from "./entities/event.entity";
import { EventsGateway } from "./events.gateway";
import { EventResolver } from "./events.resolver";
import { EventService } from "./events.service";


@Module({
    imports:[
        TypeOrmModule.forFeature([
            Event,
            User
        ]),
        
    ],
    
    providers:[EventService,EventResolver,EventsGateway]
})
export class EventsModule{}