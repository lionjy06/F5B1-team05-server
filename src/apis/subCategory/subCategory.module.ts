import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";
import { SubCategory } from "./entities/subCategory.entity";
import { SubCategoryResolver } from "./subCategory.resolver";
import { SubCategoryService } from "./subCategory.service";



@Module({
    imports:[
        TypeOrmModule.forFeature([
            SubCategory,
            
        ])
    ],
    providers:[SubCategoryResolver, SubCategoryService]
})
export class SubCategoryModule{}