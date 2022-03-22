import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BrandResolver } from "./brand.resolver";
import { BrandService } from "./brand.service";
import { Brand } from "./entities/brand.entity";


@Module({
    imports:[
        TypeOrmModule.forFeature([Brand])
    ],
    providers:[BrandResolver, BrandService]
})
export class BrandModule{}