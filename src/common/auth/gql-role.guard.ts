import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './gql-role.param';
import { Role } from 'src/apis/user/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('113322-------------------------')
    if (!requiredRoles) return true;

    const gqlContext =
      GqlExecutionContext.create(context).getContext().req.user;
    console.log('++++++++++++++++++++++++++')
    console.log(gqlContext)
    return (
      gqlContext && gqlContext.role && requiredRoles.includes(gqlContext.role)
    );
  }
}
