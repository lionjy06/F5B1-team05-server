
import { ConflictException } from "@nestjs/common";
import { Args, Mutation, Resolver,Query } from "@nestjs/graphql";
import { Order } from "./entities/order.entity";
import { OrderService } from "./order.service";


@Resolver()
export class OrderResolver{
    constructor(
        private readonly orderService:OrderService
    ){}

    @Mutation(() => Order)
    async createOrder(
        @Args('impUid') impUid: string, // 수정할 곳 : 파라미터 적절하지 않음--완료
        @Args('price') price: number,
        // @Args('status') status:enum // enum은 프론트에서 안받아오면 어디서 받아오나?
        // 무슨 물품인지 product를 프론트에서 받아오나?
        // currentUser는 @UseGuards(GqlAuthAccessGuard)를 통해 받아오자
    ){  
        const order = await this.orderService.findOne({impUid})
        if(order){
            throw new ConflictException('이미 존재하는 주문 입니다.') // 수정할 곳 : 오류내용--완료
        }
        return await this.orderService.create({impUid, price})
    }
 
    @Mutation(() => Boolean)
    async deleteOrder(
        @Args('orderId') orderId:string
    ){
        return await this.orderService.delete({orderId}) // 오류나는 이유 : service에서 구현하지 않은 함수니까
    }

    @Query(() => Order)
    async fetchOrder(
        @Args('impUid') impUid:string // 수정할 곳 : 파라미터 적절하지 않음--완료
        ){
        return this.orderService.findOne({impUid})
    }
    @Query(()=>[Order])
    async fetchOrders(){
        return this.orderService.findAll()
    }
}