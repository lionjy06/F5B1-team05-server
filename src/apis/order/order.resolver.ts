
import { ConflictException, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";


@Resolver()
export class OrderResolver{
    constructor(
        private readonly orderService:OrderService
    ){} 

    
    @UseGuards(GqlAuthAccessGuard) 
    @Mutation(() => Order)
    async createOrder( 
        @CurrentUser() currentUser: ICurrentUser, //구매자
        @Args('impUid') impUid: string,   
        @Args('productId') productId : string,   
        @Args('status') status:string,  
    ){  
        return await this.orderService.create({currentUser, impUid, productId, status})
    }
 
    
    
    @Mutation(() => Boolean)
    async deleteOrder(
    @Args('orderId') orderId:string
    ){
        return await this.orderService.delete({orderId})  
    }
        
    @Query(() => Order)
    async fetchOrder(
    @Args('orderId') orderId:string 
    ){
        return this.orderService.findOneById({orderId})
    }
    @Query(()=>[Order], { nullable: 'items' }) // 사이트 전체에서 주문한 물건이 없을 수도 있으니까
    async fetchOrders(){
        return this.orderService.findAll()
    }

    @UseGuards(GqlAuthAccessGuard) 
    @Query(() => [Order], { nullable: 'items' }) // 구매한 물건이 없다면 오류대신 null값이 오게
    async fetchBuyerOrders( 
        @CurrentUser() currentUser: ICurrentUser, //구매자  
    ){  
        return await this.orderService.findBuyerNBuyerOrders({currentUser}, "buyer")
    }

    @UseGuards(GqlAuthAccessGuard) 
    @Query(() => [Order], { nullable: 'items' }) // 파매한 물건이 없다면 오류대신 null값이 오게
    async fetchSellerOrders( 
        @CurrentUser() currentUser: ICurrentUser, //판매자  
    ){  
        return await this.orderService.findBuyerNBuyerOrders({currentUser}, "seller")
    }
}