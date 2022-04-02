import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.param';
import { GqlAuthAccessGuard, GqlAuthRefreshGuard } from 'src/common/auth/gql-auth.guard';
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
    @Context() context: any,

  ) {
    const user = await this.userService.findEmail({email});
    const isAuthenticated = await bcrypt.compare(password, user.password);
    if (!isAuthenticated)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

  

    const refreshToken = await this.authService.setRefreshToken({ user, res: context.res });
    console.log('avxxzz',refreshToken)    

    const accessToken = this.authService.getAccessToken({ user });
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
      `refreshToken:${refreshToken}`,refreshToken,
      { ttl: refresh.exp - Math.floor(Date.now() / 1000) + 60 * 60 },
    );

    await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
      ttl: access.exp - Math.floor(Date.now() / 1000) + 60 * 60,
    });

    
    return '성공이다';
  }


  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(@CurrentUser() currentUser: ICurrentUser) {
    return this.authService.getAccessToken({ user: currentUser });
  }
}
