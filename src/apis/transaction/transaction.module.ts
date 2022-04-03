
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Transaction } from "./entities/transaction.entity";
import { TransactionResovler } from "./transaction.resolver";
import { TransactionService } from "./transaction.service";


@Module({
    imports:[TypeOrmModule.forFeature([Transaction,User])],
    providers:[TransactionService, TransactionResovler]
})
export class TransactionModule{}