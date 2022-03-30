import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookies = req.headers.cookies;
        console.log('123123111', cookies)
        return cookies.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }


  async validate(req, payload: any) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    console.log('111111', accessToken);
    const confirm = await this.cacheManager.get(`accessToken:${accessToken}`);
    if (confirm) throw new UnprocessableEntityException();
    return {
      id: payload.sub,
      email: payload.email,
      exp: payload.exp,
    };
  }
}
