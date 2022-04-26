import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { getRepository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER, ConflictException } from '@nestjs/common';
import { Admin } from '../../admin/entities/admin.entity';
import { Product } from 'src/apis/product/entities/product.entity';
import { Review } from 'src/apis/review/entities/review.entity';


class MockUserRepository {
    myUser = [
        {
            email:"jyjjyj06@naver.com",
            password:"1234",
            nickname:"hahaha",
            name:"양진영",
            phoneNum:"01011112222"
        },
        {
            email:"abcCorp@naver.com",
            password:"1234",
            nickname:"hohoho",
            name:"김철수",
            phoneNum:"01033334444"
        },
        {
            email:"zzz@gmail.com",
            password:"1234",
            nickname:"hehehe",
            name:"이영희",
            phoneNum:"01055556666"
        },
    ]

    findEmail({email}){
        const users = this.myUser.filter(el => el.email === email)
        if(users.length) return users[0];
        return null
    }

    save({password, email, nickname, name, phoneNum}){
        this.myUser.push({password, email, nickname, name, phoneNum})
    }    
}

describe('UserService', () => {
    let userService : UserService;

    beforeEach(async () => {
        const userModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
                {
                    provide: CACHE_MANAGER,
                    useFactory: jest.fn(),
                },
            ],
        }).compile()

        userService = userModule.get<UserService>(UserService)
    })

    describe('create', () => {
        it('회원가입', async () => {
            const myDB = {
                email:'jyjjyj06@naver.com',
                password:"1234",
                name:"양진영",
                phoneNum:'01011112222',
                nickname:"hahaha"
            }
            try{
                const {email, password, name, phoneNum, nickname} = myDB
                const hashedPassword = await bcrypt.hash(password, 5);
                userService.create({email, hashedPassword, name, phoneNum, nickname})
            } catch(error){
                expect(error).toBeInstanceOf(ConflictException)
            }
        })
        // it('회원등록 잘됫는지 검증', async () => {
        //     const myDB = {
        //         email:'jyjjyj06@naver.com',
        //         password:"1234",
        //         name:"양진영",
        //         phoneNum:'01011112222',
        //         nickname:"hahaha"
        //     }
            
        //     try{
        //     const {email, password, name, phoneNum, nickname} = myDB
        //     const hashedPassword = password
        //     const result = await userService.create({email, hashedPassword, name, phoneNum, nickname}) 
        //     expect(result).toStrictEqual({email:'jyjjyj06@naver.com',
        //     password:"1234",
        //     name:"양진영",
        //     phoneNum:'01011112222',
        //     nickname:"hahaha"})
        //     } catch(error){
        //         expect(error).toBeInstanceOf(ConflictException)
        //     }
            
        // })
        // it('findEmail', async () => {
        //     const myDB = {
        //         email:'jyjjyj06@naver.com',
        //         password:"1234",
        //         name:"양진영",
        //         phoneNum:'01011112222',
        //         nickname:"hahaha"
        //     }
        //     const email = 'jyjjyj06@naver.com'
            
        //     const result = await userService.findemail({email})
        //     try{
        //         expect(result).toStrictEqual({...myDB})
        //     }catch(error){
        //         expect(error).toBeInstanceOf(ConflictException)
        //     }
        // })
    })
})