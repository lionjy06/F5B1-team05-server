import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { UserAddr } from "./entities/userAddr.entity";
import { UserAddrResolver } from "./userAddr.resolver";
import { UserAddrService } from "./userAddr.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            UserAddr,
            User
        ])
    ],
    providers:[UserAddrResolver, UserAddrService]
})
export class UserAddrModule{}