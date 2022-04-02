import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}



  setRefreshToken({ user, res }) {
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id, role:user.role },
      { secret: 'myRefreshKey', expiresIn: '2w' },
    );
    console.log('111111aaa11',refreshToken);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.project5-sos.shop; SameSite=None; Secure;httpOnly`) 
  
    return refreshToken
    }

  getAccessToken({ user }) {
    const accessToken = this.jwtService.sign(
      
      { email: user.email, sub: user.id, role:user.role },
      { secret: 'myAccesskey', expiresIn: '5h' },
      
    );
    return accessToken;
  }
}
