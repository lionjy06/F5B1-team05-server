import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "../brand/entities/brand.entity";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";

import { SubCategory } from "../subCategory/entities/subCategory.entity";
import { Product } from "./entities/product.entity";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";


@Module({
    imports:[
        TypeOrmModule.forFeature([
            Product,
            SubCategory,
            
            MainCategory,
            Brand
        ])
    ],
    providers:[ProductResolver,ProductService]
})
export class ProductModule{}