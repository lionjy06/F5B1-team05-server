import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}



  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    console.log('111111aaa11');
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}`);
  }

  getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      
      { email: user.email, sub: user.id },
      { secret: 'myAccesskey', expiresIn: '1h' },
      
    );
    return accessToken;
  }
}
