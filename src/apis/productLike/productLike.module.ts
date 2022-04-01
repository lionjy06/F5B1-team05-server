import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "../product/entities/product.entity";
import { ProductService } from "../product/product.service";
import { User } from "../user/entities/user.entity";
import { ProductLike } from "./entities/productLike.entity";
import { ProductLikeResolver } from "./productLike.resolver";
import { ProductLikeService } from "./productLike.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            ProductLike,
            Product,
            User
        ])
    ],
    providers:[ProductLikeResolver, ProductLikeService]
})
export class ProductLikeModule{}