import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Brand } from "../brand/entities/brand.entity";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";
import { Product } from "../product/entities/product.entity";
import { ProductService } from "../product/product.service";
import { SellerInfo } from "../sellerInfo/sellerInfo.entities.ts/sellerInfo.entity";
import { SubCategory } from "../subCategory/entities/subCategory.entity";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { Review } from "./entities/review.entity";
import { ReviewResolver } from "./review.resolver";
import { ReviewService } from "./review.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([
            Review,
            Product,
            User,
            Brand,
            SubCategory,
            MainCategory,
            SellerInfo
        ])
    ],
    providers:[ReviewResolver, ReviewService,UserService,ProductService]
})
export class ReviewModule{}