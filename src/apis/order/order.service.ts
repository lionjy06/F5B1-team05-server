import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
// import { CurrentUser } from "src/common/auth/gql-user.param";
import { Connection, getRepository, Repository } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Order, ORDER_STATUS_ENUM } from "./entities/order.entity";


@Injectable()
export class OrderService{
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository:Repository<Order>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        private readonly connection: Connection
    ){}
    

    async create({impUid, productId, price, status}){ // 수정할 곳 : 파라미터를 수정하기. 엔터티를 참고

        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');    
        try{
            // user 있는 건지 확인
            // if(!user) throw new ConflictException('없는 유저입니다.')
    
            // 물품 찾기
            const product = await this.productRepository.findOne({id:productId});
            if(!product) throw new ConflictException('물품이 없습니다');

            status = status.toUpperCase();
            let statusEnum = null;
            if(status === "PAYMENT") statusEnum = ORDER_STATUS_ENUM.PAYMENT;
            else if(status === "EXAMINATION") statusEnum = ORDER_STATUS_ENUM.EXAMINATION;
            else if(status === "ONTHEWAY") statusEnum = ORDER_STATUS_ENUM.ONTHEWAY;
            else if(status === "DELIVERED") statusEnum = ORDER_STATUS_ENUM.DELIVERED;
            else if(status === "CANCEL") statusEnum = ORDER_STATUS_ENUM.CANCEL; 
            else queryRunner.rollbackTransaction();

            const orderTransaction = await this.orderRepository.create({
                impUid,
                price,
                //user : currentUser,
                product : product,
                status: statusEnum //결제완료일 때
            });
            await this.orderRepository.save(orderTransaction) 
    
            return orderTransaction;
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        } 
    }

    async delete({orderId}){
        const result = await this.orderRepository.softDelete({id:orderId})
        return result.affected ? true: false
    }

    async findAll(){
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED'); 
        try{
            return await this.orderRepository.find() 
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    }

    async findOneById({orderId}){  
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED'); 
        try{
            return await this.orderRepository.findOne({id: orderId}) 
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    } 
}