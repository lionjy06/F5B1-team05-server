import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, getRepository, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Transaction, TRANSACTION_STATUS_ENUM } from "./entities/transaction.entity";



@Injectable()
export class TransactionService{
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository:Repository<Transaction>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        private readonly connection:Connection
    ){}



        async fetchimpuidwithproductiduserid({productid}){
            return await getRepository(Transaction)
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.product','product')
            .where('product.id =:id',{id : productid})
            .orderBy('transaction.createdAt','DESC')
            .getOne();
        }

        async createTransaction({impuid,amount,currentUser}){
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

                  const transaction = await this.transactionRepository.create({
                    impUid: impuid,
                    amount: amount,
                    user: user,
                    status: TRANSACTION_STATUS_ENUM.PAYMENT,
                  });

                  await queryRunner.manager.save(Transaction, transaction);

                  await queryRunner.commitTransaction();

                  return transaction
            }catch{

            }finally{

            }
        }

        
}