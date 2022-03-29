
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

    
    @UseGuards(GqlAuthAccessGuard)//테스트 편의성을 위해 주석
    @Mutation(() => Order)
    async createOrder( 
        @CurrentUser() currentUser: ICurrentUser, //구매자
        @Args('impUid') impUid: string,  // IamPort id
        @Args('productId') productId : string,  // 물품 ID
        @Args('status') status:string, // 설명을 graphql에 써놓으면 좋겠다
    ){  
        return await this.orderService.create({currentUser, impUid, productId, status})
    }
 
    @Mutation(() => Boolean)
    async deleteOrder(
        @Args('orderId') orderId:string
    ){
        return await this.orderService.delete({orderId}) // 오류나는 이유 : service에서 구현하지 않은 함수니까
    }

    @Query(() => Order)
    async fetchOrder(
        @Args('orderId') orderId:string // 수정할 곳 : 파라미터 적절하지 않음--완료
        ){
        return this.orderService.findOneById({orderId})
    }
    @Query(()=>[Order])
    async fetchOrders(){
        return this.orderService.findAll()
    }
}