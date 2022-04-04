import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { query } from "express";
import { Connection, getRepository, Repository } from "typeorm";
import { UpdateProductInput } from "../product/dto/updateProductIntput";
import { Product } from "../product/entities/product.entity";
import { User } from "../user/entities/user.entity";
import { ProductLike } from "./entities/productLike.entity";



@Injectable()
export class ProductLikeService{
    constructor(
        @InjectRepository(ProductLike)
        private readonly productLikeRepository:Repository<ProductLike>,

        @InjectRepository(Product)
        private readonly productRepository:Repository<Product>,

        @InjectRepository(User)
        private readonly userRepository:Repository<User>,

        private readonly connection:Connection
    ){}

    async findProductLike({currentUser}){
        const product =  await getRepository(Product)
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.user','productUser')
        .leftJoinAndSelect('product.productLike','productLike')
        // .leftJoinAndSelect('productLike.user','productUser')
        .leftJoinAndSelect('productLike.user','user')
        .where('productLike.islike',{islike:true})
        .andWhere('productUser.id = :id',{user_id:currentUser.id})
        .andWhere('user.id = :id',{user_id:currentUser.id})
        .getMany()

        console.log('this is findProductLike', product)
        return product
    }

    async like({productId,currentUser}){
        const queryRunner = await this.connection.createQueryRunner()

        await queryRunner.connect()
        await queryRunner.startTransaction('SERIALIZABLE')
        
        try{
            const product = await queryRunner.manager.findOne(Product,
                {product_id:productId},
                {lock:{mode : 'pessimistic_write'}}
                )

            const user = await queryRunner.manager.findOne(User,{
                id:currentUser.id
            })    
            const productLike = await queryRunner.manager.findOne(ProductLike,{
                user:currentUser.id,
                product:productId
            })

            if(!productLike){
                const createLike = await this.productLikeRepository.create({
                     islike:true,
                     user,
                     product,
                })

                const like = product.like + 1

                const updateProduct = await this.productRepository.create({
                ...product,
                like
                })

                await queryRunner.manager.save(updateProduct)

                const result = await queryRunner.manager.save(createLike)
                
                await queryRunner.commitTransaction()

                return result
            }

            if(!productLike.islike){
                const createLike = await this.productLikeRepository.create({
                    ...productLike,
                    islike:true
                })

                const like = product.like + 1

                const updateProduct = await this.productRepository.create({
                    ...product,
                    like,
                })

                await queryRunner.manager.save(updateProduct)

                const result = await queryRunner.commitTransaction()
                return result
            }
            const createlike = await this.productLikeRepository.create({
                ...productLike,
                islike: false,
              });
              const like = product.like; - 1;
        
              const updateProduct = await this.productRepository.create({
                ...product,
                like,
              });

            await queryRunner.manager.save(updateProduct);

            const result = await queryRunner.manager.save(createlike);
      
            await queryRunner.commitTransaction();
      
            return result;

            

        }catch (error) {
            await queryRunner.rollbackTransaction();
          } finally {
            await queryRunner.release();
          }
    }
}