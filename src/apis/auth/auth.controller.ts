import { Get, UseGuards, Req, Res, Controller } from '@nestjs/common';
import { Args } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
//social login 인증된 유저
interface IOauthUser {
  user: Pick<User, 'email' | 'password' | 'nickname'| 'name'  | 'phoneNum'>;
}

@Controller()
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}


  async login(req, res) {
    const user = await this.userService.findEmail({ email: req.user.email });
    if (!user) {
      const { password, email, nickname, phoneNum, name } = req.user;
      const hashedPassword = await bcrypt.hash(String(password), 5);
      
      await this.userService.create({ email, name, nickname, phoneNum, hashedPassword });
    }
    this.authService.setRefreshToken({ user, res });
    res.redirect('https://www.youth&luxury.shop');
  }

  @Get('/login/google/callback')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOauthUser, //
    @Res() res: Response,
  
  ) {
    return await this.login(req,res)
  }

  @Get('/login/kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOauthUser, 
    @Res() res: Response,
  
    ) {
      return await this.login(req, res);
  }
}
