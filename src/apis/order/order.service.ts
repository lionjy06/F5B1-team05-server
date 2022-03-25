import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { getRepository, Repository } from "typeorm";
import { Order } from "./entities/order.entity";


@Injectable()
export class OrderService{
    @InjectRepository(Order)
    private readonly orderRepository:Repository<Order>

    async create({name}){ // 수정할 곳 : 파라미터를 수정하기. 엔터티를 참고
        return await this.orderRepository.save({name})
    }

    async delete({orderId}){
        const result = await this.orderRepository.softDelete({id:orderId})
        return result.affected ? true: false
    }

    async findAll(){
        return await this.orderRepository.find()
    }

    async findOne({name}){ 
        // 다양한 조건으로 사용자는 찾는다.
        // 검색조건은 피그마에서 확인
        // 조건 : 물품이름, 자기가 산 물건, 산 날짜,
        // 물품의 이름으로 찾는 방법으로 바꾸자, 보통 우리는 물품이름으로 찾는다
        //
        let result = await this.orderRepository.findOne({product : name})
        return result
    }

    async findById({id:mainCategoryId}){
        return this.orderRepository.findOne({id:mainCategoryId})
    } 
}