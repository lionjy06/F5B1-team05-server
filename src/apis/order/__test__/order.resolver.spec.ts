import {Test} from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { OrderService } from '../order.service';

class MockOrderRepository {
    mockDB = [
        {
            user : {
                id: "구매자ID123",
                email : "구매자@naver.com",
                password: "qwerty",
                nickname : "nickname123",
                name : "name123",
                phoneNum : "01011112222"
            },
            impUid : "mockImpUid0022",
            product: {
                id: "productID123",
                brand : {
                    id: "brandId123",
                    name: "brandName"
                },
                subCategory:{
                    id: "subCategoryId123",
                    name : "subCaName123",
                    mainCategory : {
                        id: "mainCategoryId123",
                        name: "mainCategoryName123"
                    }
                },
                user : {
                    id: "판매자Id123",
                    email : "판매자@naver.com",
                    password: "qwerty",
                    nickname : "nickname1234",
                    name : "name1234",
                    phoneNum : "01011112223"
                },
                name: "productName",
                description: "productDescription",
                price:3000,
                urls:"productURLS",
            }, 
            status: "PAYMENT"
        }
    ]
}

describe("오더 그룹", ()=>{
    let orderService: OrderService
    
    beforeEach(async ()=>{  

        const orderModule = await Test.createTestingModule({ 
            providers: [OrderService,{
                provide: getRepositoryToken(Order),
                useClass: MockOrderRepository,
            }]
        }).compile();

        orderService = orderModule.get<OrderService>(OrderService);
    })

    it("createOrder 테스트", async () =>{
        let myDB =  {
            user : {
                id: "구매자ID123",
                email : "구매자@naver.com",
                password: "qwerty",
                nickname : "nickname123",
                name : "name123",
                phoneNum : "01011112222"
            },
            impUid : "mockImpUid0022",
            product: {
                id: "productID123",
                brand : {
                    id: "brandId123",
                    name: "brandName"
                },
                subCategory:{
                    id: "subCategoryId123",
                    name : "subCaName123",
                    mainCategory : {
                        id: "mainCategoryId123",
                        name: "mainCategoryName123"
                    }
                },
                user : {
                    id: "판매자Id123",
                    email : "판매자@naver.com",
                    password: "qwerty",
                    nickname : "nickname1234",
                    name : "name1234",
                    phoneNum : "01011112223"
                },
                name: "productName",
                description: "productDescription",
                price:3000,
                urls:"productURLS",
            }, 
            status: ORDER_STATUS_ENUM.PAYMENT
        }
        const currentUser = myDB.user;
        const {impUid} = myDB;
        const productId = myDB.product.id;
        const status = myDB.status;
        const result = await orderService.create({currentUser, impUid, productId, status}); // 돈이 충분하다고 가정
    
        expect(result).toBe(true);
    }) 
}) 