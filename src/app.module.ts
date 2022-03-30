import { Module, CacheModule } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './apis/product/product.module';
import { MainCategoryModule } from './apis/mainCategory/mainCategory.module';
import { SubCategoryModule } from './apis/subCategory/subCategory.module';
import { BrandModule } from './apis/brand/brand.module';

import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';
import { ReviewModule } from './apis/review/review.module';
import { AdminCateogryModule } from './apis/adminCategory/adminCategory.module';
import { AdminQueryModule } from './apis/adminQuery/adminQuery.module';
import { OrderModule } from './apis/order/order.module';

import { FileModule } from './apis/file/file.module';
import { UserAddrModule } from './apis/userAddr/userAddr.module';
// import { ChatModule } from './apis/chat/chat.module';

@Module({
  imports: [
    UserAddrModule,
    // ChatModule,
    FileModule,
    OrderModule,
    AdminCateogryModule,
    AdminQueryModule,
    AuthModule,
    UserModule,
    ReviewModule,
    BrandModule,
    SubCategoryModule,
    MainCategoryModule,
    ProductModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
      cors:{
        origin:"http://localhost:3000", 
        credential:true
      }
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my_database',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'teamproject',
      entities: [__dirname + '/apis/**/*.entity.*'], 
 
      synchronize: true,
      logging: true,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore, 
      url: 'redis://my_redis:6379',
      isGlobal: true, 
    }),
  ],

})
export class AppModule {}
