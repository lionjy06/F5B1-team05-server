import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserAddr } from "./entities/userAddr.entity";
import { UserAddrResolver } from "./userAddr.resolver";
import { UserAddrService } from "./userAddr.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            UserAddr
        ])
    ],
    providers:[UserAddrResolver, UserAddrService]
})
export class UserAddrModule{}