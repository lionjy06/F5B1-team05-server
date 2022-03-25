import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminCategoryResolver } from "./adminCategory.resolver";
import { AdminCategoryService } from "./adminCategory.service";
import { AdminCategory } from "./entities/adminCategory.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([
            AdminCategory
        ])
    ],
    providers:[AdminCategoryResolver, AdminCategoryService]
})
export class AdminCateogryModule{}