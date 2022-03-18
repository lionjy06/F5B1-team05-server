import {
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';
import { IContext } from 'src/common/types/context';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() context: IContext,
  ) {
    const user = await this.userService.findOne({ email });
    if (!user) throw new UnprocessableEntityException('이메일이 옳지않아요...');
  
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
    this.authService.setRefreshToken({ user, res: context.res });
    const accessToken = this.authService.getAccessToken({ user });
    let decoded;

    try {
      decoded = jwt.verify(accessToken, 'myAccessKey');
    } catch (error) {
      throw new UnauthorizedException('에러납니까?');
    }
    console.log(accessToken)
    return accessToken;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(
    @Context() context: any,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    const refreshToken = context.req.headers.cookie.split('refreshToken=')[1];
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    
    let access;
    let refresh;
    try {
      access = jwt.verify(accessToken, 'myAccessKey');
      refresh = jwt.verify(refreshToken, 'myRefreshKey');
    } catch (error) {
      throw new UnauthorizedException('에러납니까?');
    }

    await this.cacheManager.set(
      `refreshToken:${refreshToken}`,
      `refreshToken`,
      { ttl: refresh.exp - Math.floor(Date.now() / 1000) + 60 * 60 },
    );

    await this.cacheManager.set(`accessToken:${accessToken}`, `accessToken`, {
      ttl: access.exp - Math.floor(Date.now() / 1000) + 60 * 60,
    });
    const mycache = await this.cacheManager.get(`refreshToken:${refreshToken}`);
    console.log(mycache);
    return '성공이다';
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  async restoreAccessToken(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
