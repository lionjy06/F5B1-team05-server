
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
    async createMainCategory(
        @Args('name') name:string // 수정할 곳 : 파라미터 적절하지 않음
    ){  
        const category = await this.orderService.findOne({name})
        if(category){
            throw new ConflictException('이미 존재하는 카테고리 입니다.') // 수정할 곳 : 오류내용
        }
        return await this.orderService.create({name})
    }

    @Mutation(() => Boolean)
    async deleteOrder(
        @Args('orderId') orderId:string
    ){
        return await this.orderService.delete({orderId}) // 오류나는 이유 : service에서 구현하지 않은 함수니까
    }
    @Query(() => Order)
    async fetchOrder(
        @Args('name') name:string // 수정할 곳 : 파라미터 적절하지 않음
        ){
        return this.orderService.findOne({name})
    }
    @Query(()=>[Order])
    async fetchOrders(){
        return this.orderService.findAll()
    }
}