import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminCategory } from "../adminCategory/entities/adminCategory.entity";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { AdminQueryResolver } from "./adminQuery.resolver";
import { AdminQueryService } from "./adminQuery.service";
import { AdminQuery } from "./entities/adminQuery.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([
            AdminQuery,
            User,
            AdminCategory
            
        ])
    ],
    providers:[AdminQueryResolver,AdminQueryService,UserService]
})
export class AdminQueryModule{}