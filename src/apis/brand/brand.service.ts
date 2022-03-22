import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Brand } from "./entities/brand.entity";



@Injectable()
export class BrandService{
    @InjectRepository(Brand)
    private readonly brandRepository:Repository<Brand>

    async create({name}){
        return await this.brandRepository.save({name})
    }

    async delete({id:productImgId}){
        const result = await this.brandRepository.softDelete({id:productImgId})
        return result.affected ? true: false
    }

    async findOne({name}){
        return await this.brandRepository.findOne({name})
    }

    async findAll(){
        return await this.brandRepository.find()
    }
}