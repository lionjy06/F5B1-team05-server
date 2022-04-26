import { CacheModule, CACHE_MANAGER, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
    imports:[
        CacheModule.register(),
        TypeOrmModule.forFeature([
            User
        ]),
        
    ],
    providers: [UserResolver, UserService]
})
export class UserModule{}