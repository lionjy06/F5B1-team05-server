import { IoAdapter } from "@nestjs/platform-socket.io";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket} from 'socket.io'
import { CurrentUser } from "src/common/auth/gql-user.param";
import { EventResolver } from "./events.resolver";
import { EventService } from "./events.service";
import { onlineMap } from "./onlineMap";

@WebSocketGateway({
    cors:{
        origin:'http://localhost:3000',
         
    },})
export class EventsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly eventResolver:EventResolver
    ){}
    @WebSocketServer() public server:Server

    @SubscribeMessage('message')
    handleMessage(client:any, payload: any):string{
        return 'hello world'
    }

    // @SubscribeMessage('login')
    // async loginUser(
    //     @MessageBody() data:{currentUser},
    //     @ConnectedSocket() socket:Socket
    // ){
    //     const {currentUser} = data
    //     const roomInfo = await this.eventResolver.loginUser(currentUser)
    //     let roomArr = []
    //     roomInfo.forEach((ele) => roomArr.push(ele.roomId))
    //     socket.emit('roomArr',roomArr)
    // }


    @SubscribeMessage('createChat')
    async createChat(
        @MessageBody() data: {productId, currentUser},
        @ConnectedSocket() socket:Socket
    ){
        const { productId, currentUser} = data
        console.log('this is for socket test',productId)
        const roomInfo = await this.eventResolver.createChat(productId,currentUser)
        
        socket.join(roomInfo.roomId)
        socket.emit('roomInfo',`${roomInfo} 소켓 정보 드립니다.`)
    }


    @SubscribeMessage('updateChat')
    async updateChat(
        @MessageBody() data: {roomId, updateChat, currentUser},
        @ConnectedSocket() socket:Socket
    ){
        const { roomId, updateChat, currentUser } = data
        const chat = await this.eventResolver.updateChat(roomId,updateChat,currentUser)
        
        socket.emit('chat',chat.chatLog)
    }

    @SubscribeMessage('joinSeller')
    async joinSeller(
        @MessageBody() data: {currentUser, roomId},
        @ConnectedSocket() socket:Socket
    ){
        const { currentUser, roomId } = data

        socket.join(roomId)
        await this.eventResolver.fetchChat(roomId)
        const roomArr = []
        const sellerInfo = await this.eventResolver.joinSeller(currentUser)
        sellerInfo.forEach((ele) => roomArr.push(ele.roomId))
        

        socket.emit('sellerInfo',roomArr)

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