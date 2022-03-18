import { Module, CacheModule } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';;
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './apis/product/product.module';

@Module({
  imports: [
    ProductModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/common/graphql/schema.gql',
      context: ({ req, res }) => ({ req, res }),
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
