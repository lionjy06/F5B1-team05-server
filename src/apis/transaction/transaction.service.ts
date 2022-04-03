import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { Transaction } from "./entities/transaction.entity";



@Injectable()
export class TransactionService{
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository:Repository<Transaction>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        private readonly connection:Connection
    ){}
}