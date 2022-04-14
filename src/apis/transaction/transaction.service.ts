import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, getRepository, Repository } from "typeorm";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Transaction, TRANSACTION_STATUS_ENUM } from "./entities/transaction.entity";



@Injectable()
export class TransactionService{
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository:Repository<Transaction>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,

        private readonly connection:Connection
    ){}

        async fetchTransactionAll(){
            return await getRepository(Transaction)
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.user','user')
            .leftJoinAndSelect('transaction.product','product')
            .leftJoinAndSelect('product.user','seller')
            .orderBy('transaction.createdAt','DESC')
            .getMany();
        }

        async fetchSellList({currentUser}){
            const seller = await getRepository(Transaction)
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.product','product')
        }

        async fetchimpuidwithproductiduserid({productid}){
            return await getRepository(Transaction)
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.product','product')
            .where('product.id =:id',{id : productid})
            .orderBy('transaction.createdAt','DESC')
            .getOne();
        }

        async createTransaction({impuid,amount,currentUser,productid}){
            const queryRunner = await this.connection.createQueryRunner();
            const queryBuiler = await this.connection.createQueryBuilder();
            await queryRunner.connect();
            await queryRunner.startTransaction('SERIALIZABLE');
            try {
                const user = await queryRunner.manager.findOne(
                    User,
                    { id: currentUser.id },
                    { lock: { mode: 'pessimistic_write' } },
                );

                const product = await this.productRepository.findOne({where:{id:productid}})
                  const transaction = await this.transactionRepository.create({
                    product,
                    impUid: impuid,
                    amount: amount,
                    user: user,
                    status: TRANSACTION_STATUS_ENUM.PAYMENT,
                  });
                  console.log('this is transaction info',transaction)
                  await queryRunner.manager.save(transaction);
                  
                  await queryRunner.commitTransaction();

                  return transaction
            }catch{
                await queryRunner.rollbackTransaction()
            }finally{
                await queryRunner.release()
            }
        }

        
}