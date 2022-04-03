import { Module } from "@nestjs/common";
import { TransactionResovler } from "./transaction.resolver";
import { TransactionService } from "./transaction.service";


@Module({
    imports:[],
    providers:[TransactionService, TransactionResovler]
})
export class TransactionModule{}