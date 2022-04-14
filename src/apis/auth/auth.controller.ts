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


  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(
    @Req() req: Request & IOauthUser, //
    @Res() res: Response,
    @Args('phoneNum') phoneNum:string,
    @Args('nickname') nickname:string,
    @Args('password') password:string
  ) {
    
    let user = await this.userService.findEmail({ email: req.user.email });
    console.log('thios is req.email',req.user.email)
    console.log('123123123',user)

    
    //페이지 리다이렉션 => 비번, 폰번호(토큰api,확인api재사용 하면 될듯), 닉네임 입력해야하는곳

    const hashedPassword = await bcrypt.hash(password, 5); 

    if (!user) {
      const { name,email } = req.user;
      

      // user = await this.userService.create({ hashedPassword,email,nickname,name,phoneNum});
    }
    
    this.authService.setRefreshToken({ user, res });
    
    res.redirect(
      //최종적으로 도착하고자 하는 페이지로 리다이렉션(우리는 메인페이지면 적당할듯)
      'http://localhost:5500/class/21-01-login-auth-param-with-refresh-cookie/frontend/social-login.html',
    );
    
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(
    @Req() req: Request & IOauthUser, 
    @Res() res: Response,
    @Args('phoneNum') phoneNum:string,
    @Args('nickname') nickname:string,
    @Args('password') password:string
    ) {
      let user = await this.userService.findEmail({ email: req.user.email });

      //리다이렉트 되는 페이지 필요

      if (!user) {
        const { name,email } = req.user;
        
  
        // user = await this.userService.create({ hashedPassword,email,nickname,name,phoneNum});
      }
    
    this.authService.setRefreshToken({ user, res });
    res.redirect(
      'http://localhost:5500/main-project/frontend/login/index.html',
    );
  }
}
