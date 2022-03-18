import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthAccessGuard extends AuthGuard(`access`) {
  getRequest(context: ExecutionContext) {
    
    console.log('어쓰가드');
    const ctx = GqlExecutionContext.create(context);
    console.log('12312333222',ctx.getContext().req)
    return ctx.getContext().req;
    
  }
}

@Injectable()
export class GqlAuthRefreshGuard extends AuthGuard(`refresh`) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

