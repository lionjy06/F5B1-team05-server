import { CACHE_MANAGER, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getRepository, Repository } from 'typeorm';
import { Role, User } from './entities/user.entity';
import axios from 'axios'
import * as bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import { Cache } from 'cache-manager';
import { UpdateUserAccountInput } from './dto/updateUserAccountInput';
import { UpdateUserInfo } from './dto/updateUserInfo.input';
import { ICurrentUser } from 'src/common/auth/gql-user.param';


export interface IUpdateAccount{
  userId:string
  updateUserAccountInput: UpdateUserAccountInput
}

export interface IUpdateUserInfo{
  updateUserInfo:UpdateUserInfo
  currentUser:ICurrentUser
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @Inject(CACHE_MANAGER)
    private readonly cacheManger: Cache,
  ) {}

  async checkValidation(phoneNum){
    try{
      return true
    }catch(error){
      if(phoneNum.length !== 10 || phoneNum.length !== 11){
        throw new UnprocessableEntityException('제대로된 번호가 아닌듯함')
      }
    }
  }

  async findemail({ email }) {
    return await this.userRepository.findOne({ email });
  }

  async getToken(myCount){
    try{

      
  if(myCount === undefined){
    console.log('에러발생! 갯수를 제대로 입력해 주세요')
    return
  } else if(myCount <= 0 ){
    console.log('에러발생! 갯수가 너무적습니다.')
    return
  } else if(myCount >= 10){
    console.log('에러발생! 갯수가 너무많습니다')
    return
  }

      let result = String(Math.floor(Math.random()*(10**myCount))).padStart(myCount,'0')
      return result
    }catch(error){
      throw new UnprocessableEntityException('getToken에서 에러낫다고!!')
    }
  }

  async sendTokenToSMS(phone, token){
    const appKey = process.env.SMS_APP_KEY
    const sender = process.env.SMS_SENDER
    const XsecretKey =  process.env.SMS_XSCRET_KEY
    try {
      const result = await axios.post(`https://api-sms.cloud.toast.com/sms/v3.0/appKeys/${appKey}/sender/sms`, 
      {
        body:`안녕하세요. 인증번호는 [${token}] 입니다`,
        sendNo: sender,
        recipientList:[
          {
            internationalRecipientNo:phone,
          }
      ]
      },
      {
        headers: {
          "X-Secret-Key": XsecretKey,
          "Content-Type": "application/json;charset=UTF-8"
          
        }
      }
    )
    console.log(result)
    return '성공'
    } catch (error) {
      
      throw new UnprocessableEntityException('토큰 발송에 실패')
    }
  
  
    
    
    
    
  }

async updateToAdmin({userId}){
  const user = await this.userRepository.findOne({id:userId})
  const updatedUser = {...user,role:Role.ADMIN}
  const newUser = await this.userRepository.save(updatedUser)
  return newUser
}


 async createToken(phoneNum,token){
  const checkPhoneNum = await this.checkValidation(phoneNum)
  if(checkPhoneNum){
    
    const tokenRedis = await this.cacheManger.set(`phoneNum:${phoneNum}`,token,{ttl:300})
    const sendToken = await this.sendTokenToSMS(phoneNum,token)
    return '됫다됫닼ㅋㅋㅋ'
  } else{
    throw new UnprocessableEntityException('토큰을 만들지 못했어용')
  }
 }

  async checkToken(phoneNum, token){
    try{
      const checkedNum = await this.cacheManger.get(`phoneNum:${phoneNum}`)
      
      if(token === checkedNum){
        await this.cacheManger.del(`phoneNum:${phoneNum}`)
        return true
      }
    }catch(error){
      return '실패'

    }
    return false
  }


  async create({ hashedPassword, email,nickname, name, phoneNum }) {
    const password = hashedPassword;
    return await this.userRepository.save({
      email,
      password,
      nickname,
      name,
      phoneNum,
      
    });
  }

  async findOne({currentUser}) {
    console.log(currentUser)
    return await this.userRepository.findOne({id:currentUser.id});
  }

  async findEmail({email}) {
    return await this.userRepository.findOne({where:{email}});
  }

  async findNick({nickname}){
    return await this.userRepository.findOne({nickname})
  }


  checkValidationEmail (myUser){
    // 1. email이 정상인지 확인(이메일의 존재여부, 골뱅이 포함여부)
    if(myUser === '' || !myUser.includes('@')){
      console.log('잘못된 형태의 이메일 입니다. 다시 확인 부탁드립니다.')
      return false
    } else {
      return true
    }
  }
  
  getWelcomeTemplate({name}){
    // 2. 이메일이 정상이니 가입환영 template 만들기
    
    
    return `
    <html>
      <head></head>
      <body>
        <h1>${name}님 가입을 환영합니다. 항상 좋은 서비스를 제공해드리는 SOSO가 되도록 하겠습니다</h1>
        
               
  
      </body>
    </html>
  `
  }
  
  async fetchusersearch({search}){
    return getRepository(User)
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.admin','admin')
    .where('user.name = :name' ,{name : search})
    .orWhere('user.nickname = :nickname',{nickname:search})
    .getMany()
  }

  async memberGreeting(user,email, mytemplate){
    // 3. 이메일의 가입환영 템플릿 전송하기
    console.log('work through?')
    const appKey = process.env.EMAIL_APP_KEY
    const sender = process.env.EMAIL_SENDER
    const XsecretKey = process.env.EMAIL_XSECRET_KEY
    await axios.post(`https://api-mail.cloud.toast.com/email/v2.0/appKeys/${appKey}/sender/mail`, 
    {
      senderAddress: sender,
      title:`[회사이름] 안녕하세요 ${user}님. 가입을 환영합니다.`,
      body:mytemplate,
      
      receiverList:[
        {
          receiveMailAddr:email,
          receiveType:"MRT0"
        }
    ]},
    {
      headers:{
        "X-Secret-Key": XsecretKey
     }
    }
  )
  
  
  
   
  }

  async findAll(){
    return await this.userRepository.find()
  }

  async updateAccount({userId,updateUserAccountInput}:IUpdateAccount){
    const user = await this.userRepository.findOne({id:userId});
    const newUser = {...user, ...updateUserAccountInput};
    const updatedAccount = await this.userRepository.save(newUser)
    return updatedAccount
  }

  async updateUser({currentUser,updateUserInfo}:IUpdateUserInfo){
    const user = await this.userRepository.findOne({where:{id:currentUser.id}})
    const {nickname, password} = updateUserInfo
    const hashedPassword = await bcrypt.hash(password,5)
    const aaa = {nickname,password:hashedPassword}
    const newUser = {...user,...aaa}
    const result = await this.userRepository.save(newUser)
    return result
  }

  async deleteUser({currentUser}){
    const result = await this.userRepository.softDelete({id:currentUser.id})
    
   
    return result.affected ? true : false
    
  }

  
}
