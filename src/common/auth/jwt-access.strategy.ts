import { Strategy, ExtractJwt } from 'passport-jwt';
import { Cache } from 'cache-manager';
import {
  Injectable,
  CACHE_MANAGER,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey',
      passReqToCallback: true,
    });
  }


  async validate(req, payload: any) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');
    console.log('111111', accessToken);
    const confirm = await this.cacheManager.get(`accessToken:${accessToken}`);
    if (confirm)
      throw new UnprocessableEntityException('로그아웃을 생활화합시다');
    return {
      id: payload.sub,
      email: payload.email,
      exp: payload.exp,
    };
  }
}
