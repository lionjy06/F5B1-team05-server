import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { Event } from "./entities/event.entity";
import { EventService } from "./events.service";


@Resolver()
export class EventResolver{
    constructor(
        private readonly eventService:EventService,
        
    ){}

    @UseGuards(GqlAuthAccessGuard)
    @Query(() => [Event])
    async fetchChat(
        @Args('roomId') roomId:string,
        
        
    ){
        return await this.eventService.fetchChat({roomId})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Event)
    async createChat(
        @Args('roomId') roomId:string,
        @CurrentUser() currentUser:ICurrentUser,
        @Args('chatLog') chatLog:string
    ){
        return await this.eventService.createChat({roomId,currentUser,chatLog})
    }
}