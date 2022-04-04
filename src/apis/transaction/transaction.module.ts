
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IamportService } from "../import/import.service";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { Transaction } from "./entities/transaction.entity";
import { TransactionResovler } from "./transaction.resolver";
import { TransactionService } from "./transaction.service";

//
@Module({
    imports:[TypeOrmModule.forFeature([Transaction,User,Product])],
    providers:[TransactionService, TransactionResovler,IamportService]
})
export class TransactionModule{}