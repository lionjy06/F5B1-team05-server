import { Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
// import { CurrentUser } from "src/common/auth/gql-user.param";
import { getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Order, PAYMENT_STATUS_ENUM } from "./entities/order.entity";


@Injectable()
export class OrderService{
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository:Repository<Order>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}
    

    async create({impUid, price}){ // 수정할 곳 : 파라미터를 수정하기. 엔터티를 참고

        // user 있는 건지 확인
        // if(!user) throw new ConflictException('없는 유저입니다.')

        const orderTransaction = await this.orderRepository.create({
            impUid,
            price,
            //user : currentUser,
            status: PAYMENT_STATUS_ENUM.PAYMENT
        }); 
        await this.orderRepository.save(orderTransaction) 

        return
    }

    async delete({orderId}){
        const result = await this.orderRepository.softDelete({id:orderId})
        return result.affected ? true: false
    }

    async findAll(){
        return await this.orderRepository.find()
    }

    async findOne({impUid}){ 
        // 다양한 조건으로 사용자는 찾는다.
        // 검색조건은 피그마에서 확인
        // 조건 : 물품이름, 자기가 산 물건, 산 날짜,
        // 물품의 이름으로 찾는 방법으로 바꾸자, 보통 우리는 물품이름으로 찾는다
        //
        let result = await this.orderRepository.findOne({impUid : impUid})
        return result
    }

    async findById({id:mainCategoryId}){
        return this.orderRepository.findOne({id:mainCategoryId})
    } 
}