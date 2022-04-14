import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ICurrentUser } from "src/common/auth/gql-user.param";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { CreateUserAddrInput } from "./dto/createUserAddr.input";
import { UserAddr } from "./entities/userAddr.entity";

export interface ICreate {
    createUserAddrInput:CreateUserAddrInput
    currentUser:ICurrentUser
}

@Injectable()
export class UserAddrService{
    constructor(
        @InjectRepository(UserAddr)
        private readonly userAddrRepository:Repository<UserAddr>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>
    ){}

    async create({createUserAddrInput,currentUser}:ICreate){
        
        const user = await this.userRepository.findOne({where:{id:currentUser.id}})

        return await this.userAddrRepository.save({...createUserAddrInput, user})
    }

    async update({updateUserAddrInput,currenUser}){
        const userAddr = await this.userAddrRepository.findOne({where:{user:currenUser.id},relations:['user']})
        const newUserAddr = {...userAddr,...updateUserAddrInput}
        const result = await this.userAddrRepository.save(newUserAddr)
        return result
    }

    async delete({userAddrId}){
        const result = await this.userAddrRepository.softDelete({id:userAddrId})
        result.affected ? true: false
    }

    async fetchUserAddr({currentUser}){
        

        return await this.userAddrRepository.findOne({where:{user:currentUser.id},relations:['user']})
    }

    async fetchUserAddrs({currentUser}){
        
        return await this.userAddrRepository.find({where:{user:currentUser.id},relations:['user']})
    }
}