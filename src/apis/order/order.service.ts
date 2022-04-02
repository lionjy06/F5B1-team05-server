import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm"; 
import { Connection, Repository } from "typeorm";
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
    

    async create({currentUser, impUid, productId, status}){
        
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();    
        try{
            // user 있는 건지 확인
            const user = await this.userRepository.findOne({email:currentUser.email});
            if(!currentUser){
                console.log("없는 유저 입니다.");
                throw new ConflictException('없는 유저입니다.')
            } 
    
            // 물품 있는 건지 확인
            const product = await this.productRepository.findOne({id:productId});
            if(!product) {
                console.log("없는 물품 입니다.");
                throw new ConflictException('물품이 없습니다');
            } 
            
            status = status.toUpperCase();
            let statusEnum:ORDER_STATUS_ENUM;
            if(status === "PAYMENT") statusEnum = ORDER_STATUS_ENUM.PAYMENT;
            else if(status === "EXAMINATION") statusEnum = ORDER_STATUS_ENUM.EXAMINATION;
            else if(status === "ONTHEWAY") statusEnum = ORDER_STATUS_ENUM.ONTHEWAY;
            else if(status === "DELIVERED") statusEnum = ORDER_STATUS_ENUM.DELIVERED;
            else if(status === "CANCEL") {statusEnum = ORDER_STATUS_ENUM.CANCEL; }
            else {
                console.log("없는 ENUM 입니다.");
                throw new ConflictException("적절한 OrderEnum이 아닙니다");}

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
        await queryRunner.startTransaction(); 
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
        await queryRunner.startTransaction(); 
        try{
            const orders = await this.orderRepository.find({
                relations: ['product', 'user']
            }) 
            const products = await this.productRepository.find({
                relations:['user']
            }) 

            const sellerUser = products.map(val => { 
                return val.user
            })  
            orders.map((val, i) => { 
                products.map(proVal => { 
                    if(val.product.id === proVal.id){ 
                        val.product.user = proVal.user;
                    }  
                }) 
            })
             
            return orders;
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    }

    async findOneById({orderId}){  
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(); 
        try{
            return await this.orderRepository.findOne({id: orderId}) 
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    } 
 
    async findBuyerNBuyerOrders({currentUser}, isSellerOrBuyer){ 
        const queryRunner = await this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction(); 
        try{ 
            const me = await this.userRepository.findOne({email:currentUser.email});
            if(!me){
                console.log("없는 유저 입니다.");
                throw new ConflictException('없는 유저입니다.')
            }  

            const  allOrders = await this.findAll() 

            const product4Return = allOrders.filter((val)=>{  
                // val.user.id 구매자라면
                if(isSellerOrBuyer === "buyer"){
                    if(val.user.id === me.id && val.status === ORDER_STATUS_ENUM.PAYMENT){ 
                        return val;
                    } 
                }else if(isSellerOrBuyer === "seller"){
                    if(val.product.user.id === me.id && val.status === ORDER_STATUS_ENUM.PAYMENT){ 
                        return val;
                    } 
                }
            })   
            return product4Return
        }catch(error){
            queryRunner.rollbackTransaction();
        }finally{
            await queryRunner.release();
        }
    }
}