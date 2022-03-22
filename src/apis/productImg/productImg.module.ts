import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductImg } from "./entities/productImg.entity";
import { ProductImgResolver } from "./productImg.resolver";
import { ProductImgService } from "./productImg.service";


@Module({
    imports:[
        TypeOrmModule.forFeature([
            ProductImg
        ])
    ],
    providers:[ProductImgResolver, ProductImgService]
})
export class ProductImgModule{}