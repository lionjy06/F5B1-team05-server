import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserAddr } from "./entities/userAddr.entity";


@Injectable()
export class UserAddrService{
    constructor(
        @InjectRepository(UserAddr)
        private readonly userAddrRepository:Repository<UserAddr>
    ){}

    async create({userId}){
        
    }
}