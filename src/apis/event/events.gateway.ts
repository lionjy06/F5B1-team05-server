import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket} from 'socket.io'
import { CurrentUser } from "src/common/auth/gql-user.param";
import { EventResolver } from "./events.resolver";
import { EventService } from "./events.service";
import { onlineMap } from "./onlineMap";

@WebSocketGateway({namespace:/\/ws-.+/})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly eventResolver:EventResolver
    ){}
    @WebSocketServer() public server:Server

    @SubscribeMessage('message')
    handleMessage(client:any, payload: any):string{
        return 'hello world'
    }

    @SubscribeMessage('createChat')
    async createChat(
        @MessageBody() data: {productId, currentUser},
        @ConnectedSocket() socket:Socket
    ){
        const { productId, currentUser} = data

        const roomInfo = await this.eventResolver.createChat(productId,currentUser)
        socket.join(roomInfo.roomId)
        socket.emit('roomInfo',roomInfo.roomId)
    }

    @SubscribeMessage('login')
    handleLogin(
        @MessageBody() data: {id: number; channels: number[]},
        @ConnectedSocket() socket:Socket
    ){
        const newNameSapace = socket.nsp
        console.log('login', newNameSapace)
        onlineMap[socket.nsp.name][socket.id] = data.id
        newNameSapace.emit('onlineLine',Object.values(onlineMap[socket.nsp.name]))

        data.channels.forEach((channel:number)=>{
            console.log('join', socket.nsp.name, channel)
            socket.join(`${socket.nsp.name}--${channel}`)
        })
    }

    // @SubscribeMessage('new_message')
    // async createChat(
    //     @MessageBody() data: {chatLog, currentUser},
    //     @ConnectedSocket() socket:Socket
    // ){
    //     const {chatLog, currentUser } = data

    //     await this.eventService.createChat({chatLog,currentUser})

    //     socket.emit('return_message',chatLog)

    // }

    // @SubscribeMessage('enter_room')
    // async enterRoom(
    //     @MessageBody() data:string,
    //     @ConnectedSocket() socket:Socket
    // ){
    //     const roomId = data
        
    //     const chat = await this.eventService.fetchChat({roomId})

    //     console.log('this is chat logs',chat)

    //     socket.emit('chatLogs',chat)
    // }

    afterInit( server: Server):any {
        console.log('websocket server init')
    }

    handleConnection(@ConnectedSocket() socket: Socket):any {
        console.log('connected', socket.nsp.name)
        if(!onlineMap[socket.nsp.name]){
            onlineMap[socket.nsp.name] = {}
        }

        socket.emit('hello', socket.nsp.name)
    }

    handleDisconnect(@ConnectedSocket() socket:Socket):any {
        console.log('disconnected', socket.nsp.name)
        const newNameSapace = socket.nsp
        delete onlineMap[socket.nsp.name][socket.id];
        newNameSapace.emit('onlineList',Object.values(onlineMap[socket.nsp.name]))
    }
}