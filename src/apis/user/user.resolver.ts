import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { CurrentUser } from 'src/common/auth/gql-user.param';
import { ICurrentUser } from 'src/common/auth/gql-user.param';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CACHE_MANAGER, ConflictException, Inject, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { UpdateUserAccountInput } from './dto/updateUserAccountInput';





@Resolver()
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
    ) {}


  @Mutation(() => String)
  async tokenMaker(
    @Args('phoneNum') phoneNum:string
    ){
    const token = await this.userService.getToken(6)
    const sendToken = await this.userService.createToken(phoneNum, token)
    return '토큰을 발송했엉ㅇ'

  }

  @Mutation(() => Boolean)
  async tokenValidate(
    @Args('phoneNum') phoneNum:string,
    @Args('token') token:string
  ){
    return await this.userService.checkToken(phoneNum, token)
    
  }

  @Mutation(() => User)
  async createUser(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('nickname') nickname: string,
    @Args('name') name: string,
    @Args('phoneNum') phoneNum: string,
    
    
  ) {
    const user = await this.userService.findEmail({email})
    const nick = await this.userService.findNick({nickname})
    
    if(user){
      throw new ConflictException('존재하는 이메일 입니다.')
    }

    if(nick){
      throw new ConflictException('존재하는 닉네임입니다')
    }
    const hashedPassword = await bcrypt.hash(password, 5); 
    const result= await this.userService.create({ hashedPassword, email, nickname, name,phoneNum });

    const confirmedEmail = this.userService.checkValidationEmail(email)

    let greeting;

    if(confirmedEmail){
      greeting = this.userService.getWelcomeTemplate({name})
    }
    
    await this.userService.memberGreeting(name,email,greeting)
    return result
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.userService.findOne({ userId: currentUser.id });
  }

  @Query(() => [User])
  async fetchUsers(){
    return await this.userService.findAll()
  }

  @Query(()=>User)
  async fetchUserByEmail(
    @Args('userId') userId:string
  ){
    return await this.userService.findOne({userId})
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => User)
  async updateAccount(
    @Args('userId') userId:string,
    @Args('updateUserAccountInput') updateUserAccountInput: UpdateUserAccountInput
  ){
    const user = await this.userService.updateAccount({userId,updateUserAccountInput})
  }
}
