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
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['profile_image', 'account_email','profile_nickname'],
    });
  }

  async validate(accessToken: String, refreshToken: String, profile: Profile) {
    
    return {
      email: profile._json.kakao_account.email,
      name: profile.displayName,
      password: profile.id,
      phoneNum:"*",
      nickname:"anonymouse"
    };
  }
}
