
import { UseGuards } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { Resolver,Query, Mutation, Args  } from "@nestjs/graphql";
import { query } from "express";
import { GqlAuthAccessGuard } from "src/common/auth/gql-auth.guard";
import { CurrentUser, ICurrentUser } from "src/common/auth/gql-user.param";
import { MainCategory } from "../mainCategory/entities/mainCategory.entity";

import { CreateProductInput } from "./dto/createProductInput";
import { UpdateProductInput } from "./dto/updateProductIntput";
import { Product } from "./entities/product.entity";
import { ProductService } from "./product.service";




@Resolver()
export class ProductResolver{
    constructor(
        private readonly productSerivce:ProductService,
        private readonly elasticsearchService: ElasticsearchService,
    ){} 

    @Query(() => [Product])
    async fetchProducts(){
        const result = await this.elasticsearchService.search({
            index: 'testproduct8',
            query: {
                match_all: {}
            }
        });

        const returnVal = result.hits.hits.map((val:any) => {
            return {
                id : val._source.id,
                urls : val._source.urls,
                name : val._source.name,
                price : val._source.price,
                subCategory : {
                    name : val._source.subcategoryname
                },
                brand : {
                    name : val._source.brandname
                }  
            }
        })

        console.log("===============fetchProducts===============");
        console.log(JSON.stringify(returnVal, null, ' '));
        return returnVal;
    }

    @Query(() => [Product])
    async fetchProductsByKeyword(
        @Args('searchKeyword') searchKeyword: string,
    ){
        // 1. 레디스에 캐시되어 있는지 확인하기
        
        // 2. 레디스에 캐시가 있지 않다면  
         const result = await this.elasticsearchService.search({
        index: 'testproduct7',  
        query: {
          match: {name: searchKeyword}, // 이름 또는 브랜드로 검색하는 방법을 알아보자, 
          //이름을 쳤더니 이름을 포한한 것이 나온게 아니라 이름과 완전히 맞는 것을 가져온다. 따라서 match가 검색어가 '포함'인 것을 찾아보자
          // 띄어쓰기로 같은 단어를 포함하면 예상대로 출력이 나온다. 대신 '마우스', '마우스2'는 같은 단어로 인식하지 않는다. 
        },
        });
        const returnVal = result.hits.hits.map((val:any) => {
        return {
            name : val._source.name,
            description : val._source.description,
            price : val._source.price,
            view : val._source.view,
            like : val._source.like,
            urls : val._source.urls,
            }
        })
    console.log(JSON.stringify(result, null, ' '));
    console.log("===================================")
    console.log(JSON.stringify(returnVal, null, ' '));
      // 3. 엘라스틱서치에서 조회 결과가 있다면, 레디스에 검색결과 캐싱해놓기

      // 4. 최종 결과 브라우저에 리턴해주기
        // return await this.productSerivce.findAll()
    }

    @Query(() => Product)
    async fetchProduct(
        @Args('productId') productId:string, 
    ){
        return await this.productSerivce.findOne({productId})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Product)
    async createProduct(
        @CurrentUser() currentUser:ICurrentUser,
        @Args('createProductInput')createProductInput:CreateProductInput,
       
    ){
        console.log(currentUser)
        return await this.productSerivce.create({createProductInput,currentUser})
    }
    @Query(() => [Product])
    async fetchProductRelateMainCategory(
        @Args('name') name:string
    ){
        return await this.productSerivce.findProductRelateMainCategory({name})
    }

    @Query(() => [Product])
    async fetchSellerProduct(
        @Args('userId') userId:string
    ){
        return await this.productSerivce.findSellerProduct({userId})
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Product)
    async updateProduct(
      @Args(`productId`) productId: string,
      @Args(`updateProductInput`) updateProductInput: UpdateProductInput,
    ) {
      return this.productSerivce.update({ productId, updateProductInput });
    }

    @UseGuards(GqlAuthAccessGuard)
    @Mutation(() => Boolean)
    async deleteProduct(
        @Args('productId') productId:string
        
    ){
        return await this.productSerivce.delete({productId})
    }
}