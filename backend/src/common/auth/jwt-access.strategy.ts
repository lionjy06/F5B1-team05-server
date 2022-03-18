import { Strategy, ExtractJwt } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'myAccessKey', 
    });
  }

  
  async validate(payload: any) {
   console.log('3333333',payload)
    return {
      
      id: payload.sub,
      email: payload.email,
    };
    
  }
}
