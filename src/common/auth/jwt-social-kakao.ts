import { Strategy, Profile } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/kakao',
      scope: ['profile_image', 'account_email','profile_nickname'],
    });
  }

  async validate(accessToken: String, refreshToken: String, profile: Profile) {
    console.log('this is kakako profile',profile);
    console.log('nick', JSON.parse(profile._raw).properties.nickname)
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
    
    };
  }
}
