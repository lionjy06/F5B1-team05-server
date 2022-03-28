import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
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
    

    async create({currentUser, impUid, productId, status}){ // 수정할 곳 : 파라미터를 수정하기. 엔터티를 참고

        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED');    
        try{
            // user 있는 건지 확인
            const user = await this.userRepository.findOne({email:currentUser.email});
            if(!currentUser) throw new ConflictException('없는 유저입니다.')
    
            // 물품 있는 건지 확인
            const product = await this.productRepository.findOne({id:productId});
            if(!product) throw new ConflictException('물품이 없습니다');

            status = status.toUpperCase();
            let statusEnum:ORDER_STATUS_ENUM;
            if(status === "PAYMENT") statusEnum = ORDER_STATUS_ENUM.PAYMENT;
            else if(status === "EXAMINATION") statusEnum = ORDER_STATUS_ENUM.EXAMINATION;
            else if(status === "ONTHEWAY") statusEnum = ORDER_STATUS_ENUM.ONTHEWAY;
            else if(status === "DELIVERED") statusEnum = ORDER_STATUS_ENUM.DELIVERED;
            else if(status === "CANCEL") statusEnum = ORDER_STATUS_ENUM.CANCEL; 
            else throw new ConflictException("적절한 OrderEnum이 아닙니다");

            const orderTransaction = await this.orderRepository.create({
                user,
                impUid,
                product, 
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
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction('READ COMMITTED'); 
        try{
            const result = await this.orderRepository.softDelete({id:orderId})
            return result.affected ? true: false
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        } 
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