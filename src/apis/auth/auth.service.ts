import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  getAccessToken({ user }) {
    console.log(user.id);
    return this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.role },
      { secret: 'myAccessKey', expiresIn: '2h' },
    );
  }

  async setRefreshToken({ user, res }) {
    const refreshToken = await this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.role },
      { secret: 'myRefreshkey', expiresIn: '2w' },
    );
    console.log(refreshToken);
<<<<<<< HEAD
    res.setHeader('Access-Control-Allow-Origin', 'https://youthluxury.shop');
=======
    // res.setHeader('Access-Control-Allow-Origin', 'https://www.youthluxury.shop');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
>>>>>>> 508f4ac65b0a99c63304ae45f8bfb744adbbb503
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.mybackend.project5-sos.shop; SameSite=None; Secure;httpOnly`,
    );
  }

  async logout({ refreshToken, currentUser, accesstoken }) {
    const User = {
      refreshToken: refreshToken,
      ...currentUser,
    };
    await this.cacheManager.set(`accesstoken:${accesstoken}`, User, {
      ttl: User.exp,
    });
    return await this.cacheManager.set(`refreshToken:${refreshToken}`, User, {
      ttl: User.exp,
    });
  }
}
