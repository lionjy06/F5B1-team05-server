import { Strategy, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';

dotenv.config();
@Injectable()
export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    }); 
  }

  async validate(accessToken: String, refreshToken: String, profile: Profile) {
    

    
    return {
      email: profile.emails[0].value,
      name: profile.displayName,
      password: profile.id,
      phoneNum:"*",
      nickname:"anonymouse"
    }
      
    };
  }

