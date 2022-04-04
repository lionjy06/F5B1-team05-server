import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookies = req.headers.cookie;
        console.log(cookies);
        return cookies.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshkey',
      passReqToCallback: true,
    });
  }
  async validate(req, payload: any) {
    //console.log('1111111111', req.headers);
    const refreshToken = req.headers.cookie.replace('refreshToken=', '');
    const check = await this.cacheManager.get(`refreshToken:${refreshToken}`);

    if (check)
      throw new UnauthorizedException('이미 로그아웃이 된 상태입니다.');

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      exp: payload.exp,
    };
  }
}