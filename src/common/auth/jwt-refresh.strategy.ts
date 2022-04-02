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
        console.log("-------------------")
        console.log(req.headers)
        console.log("-------------------")
        const cookies = req.headers.cookie;
        
        console.log('this is req.headers',req.headers)

       // console.log('this is req header',req.headers)
        console.log('123123111', cookies)
        return cookies.replace('refreshToken=', '');
      },
      secretOrKey: 'myRefreshKey',
      passReqToCallback: true,
    });
  }


  async validate(req, payload: any) {
    const refreshToken = req.headers.authorization.replace('refreshToken=', '');
    console.log('111111', refreshToken);
    const confirm = await this.cacheManager.get(`refreshToken:${refreshToken}`);
    if (confirm) throw new UnprocessableEntityException('로그아웃 되었슴다');
    return {
      id: payload.sub,
      email: payload.email,
      exp: payload.exp,
    };
  }
}
