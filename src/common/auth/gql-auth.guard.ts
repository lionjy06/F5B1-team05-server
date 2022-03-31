import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';


export class GqlAuthAccessGuard extends AuthGuard(`access`) {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
    

    
  }
}


export class GqlAuthRefreshGuard extends AuthGuard(`refresh`) {
  getRequest(context: ExecutionContext) {
    console.log('this is context',context)
    const ctx = GqlExecutionContext.create(context);
    console.log('referesh 체크',ctx.getContext().req)
    return ctx.getContext().req;
  }
}
