import { Module } from "@nestjs/common";
import { ElasticsearchModule } from "@nestjs/elasticsearch";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "../brand/entities/brand.entity";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";

import { SubCategory } from "../subCategory/entities/subCategory.entity";
import { User } from "../user/entities/user.entity";
import { Product } from "./entities/product.entity";
import { ProductResolver } from "./product.resolver";
import { ProductService } from "./product.service";


@Module({
    imports:[
        TypeOrmModule.forFeature([
            Product,
            SubCategory,
            User,
            MainCategory,
            Brand
        ]),
        ElasticsearchModule.register({
            node: 'http://elasticsearch:9200',
        }),
    ],
    providers:[ProductResolver,ProductService]
})
export class ProductModule{}