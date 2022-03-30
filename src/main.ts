import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filter/http-exception.filter';
import * as cors from "cors"


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress())
  app.enableCors({
    origin:["http://mybackend.project5-sos.shop","http://localhost:3000"],
    credentials:true
  })
  await app.listen(3000);
}
bootstrap();
