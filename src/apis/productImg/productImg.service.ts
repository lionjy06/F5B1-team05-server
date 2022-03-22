import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductImg } from "./entities/productImg.entity";



@Injectable()
export class ProductImgService{
    @InjectRepository(ProductImg)
    private readonly productImgRepository:Repository<ProductImg>
    
    async create({urls}){
        return await this.productImgRepository.save({urls})
        
    }

    async findOne({id:productImgId}){
        return await this.productImgRepository.findOne({id:productImgId})
    }
}