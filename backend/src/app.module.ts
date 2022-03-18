
import { Module, CacheModule } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import {ApolloDriver, ApolloDriverConfig} from "@nestjs/apollo"
import { ProductModule } from './apis/product/product.module';
import { UserModule } from './apis/user/user.module';
import { AuthModule } from './apis/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    ProductModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql', 
      context: ({ req, res }) => ({ req, res }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'my_database',
      port: 3306,
      username: 'root',
      password: '072865as!',
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
