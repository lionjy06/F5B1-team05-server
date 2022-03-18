import { Catch, ExceptionFilter, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter{
    //implements ExceptionFilter : catch 를 안쓰면 빨간색 에러발생되게 하는것!
    catch(exception: HttpException){
        const status = exception.getStatus()
        const message = exception.message

        console.log('=====================')
        console.log('에러가 발생했어요!!')
        console.log('에러내용:', message)
        console.log('에러코드:', status)
        console.log('=====================')
    }
}