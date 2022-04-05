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
<<<<<<< HEAD
    origin:'https://youthluxury.shop',
=======
    // origin:'https://www.youthluxury.shop',
    origin:'http://localhost:3000',
>>>>>>> 508f4ac65b0a99c63304ae45f8bfb744adbbb503
    credentials:true
  })
  await app.listen(3000);
}
bootstrap();
