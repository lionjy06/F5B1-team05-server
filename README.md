# Youth&Luxury main backend 개발자 양진영

<img width="300px" text-align='center' alt="스크린샷 2022-04-23 오후 2 46 42" src="https://user-images.githubusercontent.com/79198426/165023798-1d2df218-a491-4eb9-a97a-16548b1437ae.png">

<b>프로젝트 기간: 2022.03.11 ~ 04.08</b><br><br>
사용한 기술 스택은 아래와 같습니다.
---
  

  
![Untitled Diagram](https://user-images.githubusercontent.com/79198426/165024456-7fc0fe2b-9210-4dd5-b022-7e9f432572ce.jpg)
<br>

프로젝트의 기획
<br>
---
최근 명품 리셀 소비자가 30%씩 성장한다는 통계와 함께 명품소비를 하는 나이대가 낮아지고 있는 추세입니다.

20,30대 뿐만 아니라 10대까지도 명품소비가 굉장히 활발한 지금 그들의 소비 패턴을 조사한 결과 자신이 소유한 명품을 적정 기간 사용한 후 물건을 소유하는 것이 아닌 중고거래로 금전적인 여유를 만들고 그 여유를 바탕으로 다른 명품을 중고로 구매한다는 것을 알게 되었습니다.

이러한 패턴은 웹거래가 익숙한 젊은 층 전반으로 비슷한 패턴을 갖고 있는것을 알게 되었고 이러한 사실을 바탕으로 저희는 젊은 나이대를 타겟층으로 잡은 명품 중고거래 서비스를 기획하였습니다.

저희의 핵심 기능이 거래에 있는 만큼 판매자와 구매자의 거래 편의를 향상 시키고 거래의 안정성을 높히는 기술을 핵심으로 선정하였습니다. 

새상품이 아닌 중고 제품이라도 **명품 자체의 진입 장벽을 낮추고 소비자 친화적인 서비스**를 구현을 목표로 하고있습니다.
<br>
<br>



서비스흐름(flow chart)
---
![KakaoTalk_Photo_2022-04-23-15-56-22-1](https://user-images.githubusercontent.com/79198426/165024862-02a6c499-ad52-4d84-b3a7-d5636bcb9196.jpeg)


* 위 서비스의 흐름에 관한 상세한 설명은 아래에서 하도록 하겠습니다.
  - ERD 및 API 소개
  - 관리자와 유저 Role에 따라 달라지는 권한분기를 위한 API개발
  - jest를 활용한 유저 생성 api Unit test 
  - Loadbalancing을 통한 부하분산 구성과 보안을 위한 https설정을 완료한 배포
  

<br>

ERD 및 API소개
---
<b>ERD</b>

![스크린샷 2022-04-15 오전 3 05 55](https://user-images.githubusercontent.com/79198426/165026240-e6307085-460e-45f2-9e17-23442aa6ea45.png)

* 테이블안의 중복되는 데이터를 줄이기 위해 정규화를 고려하여 테이블을 분리하였습니다.

<b>API 명세서</b>


<br>
# API개발 및 권한


<b>User create</b>
```
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
    return '성공'
    } catch (error) {
      
      throw new UnprocessableEntityException('토큰 발송에 실패')
    }
  }

```
<img width="364" alt="스크린샷 2022-04-25 오후 3 04 47" src="https://user-images.githubusercontent.com/79198426/165029740-4e9fbfe1-07f8-4dda-82c4-04a1db43baed.png">

<br>
     
USER LOGIN
로그인을 하였을 때 데이터베이스의 hashed password와 bcrypt와의 match 가 이루어지면 accesstoken과 refresh token이 발급되도록 JWT를 이용하여 구성하였습니다.   

<img width="1229" alt="refreshToken" src="https://user-images.githubusercontent.com/79198426/165045284-c1ba8664-c1e4-4d56-a74f-5354f3fd2365.png">

<img width="685" alt="스크린샷 2022-04-25 오후 4 57 49" src="https://user-images.githubusercontent.com/79198426/165045450-9008fd57-8cc0-4eb2-b50e-18c96ff6a7b4.png">

<br>
<b>USER LOGOUT</b>
<br>
로그아웃을 하였을 때 저장된 쿠키의 refresh token의 값을 RediS에 BLACKLIST로 등록하여 같은 정보를 담고 있을 시 이를 Validate 에서 검증하도록 진행하였습니다

```
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
  ```
  <img width="442" alt="스크린샷 2022-04-25 오후 5 03 50" src="https://user-images.githubusercontent.com/79198426/165046405-648f0f80-553e-4b3f-9484-9d279432d032.png">

<br>
<b>Strategy 및 권한</b>
로그인하였을 때 accesstoken의 주기를 짧게주고 refreshtoken을 통해 다시 재발급받는 형식으로 진행하었습니다. 따라서 accessToken의 strategy 와 refreshToken에 대한 strategy 를 사용하여서 guard를 통해 권한을 분기하여 유저의 정보를 사용하도록 하였습니다.
<br>
<br>
<b>Role에 따른 권한분기</b>
<br>
관리자 페이지에서 다룰수 있는 api를 일반 유저가 접근했을 때는 아래와 같은 에러가 발생합니다
<img width="434" alt="스크린샷 2022-04-25 오후 5 10 12" src="https://user-images.githubusercontent.com/79198426/165047571-cbd9905d-573a-4915-a48a-cb7d49798d16.png">

```
    @Roles(Role.ADMIN)
    @UseGuards(GqlAuthAccessGuard, RolesGuard)
    @Mutation(() => AdminCategory)
    async createAdminCategory(
        @Args('name') name:string
    ){
        
        return await this.adminCategoryService.create({name})
    }
```
위와 같이 롤을 설정하게 되면 접근이 가능하여 일반유저는 불가능하지만 관리자는 실행가능한 api가 실행된다.
<img width="502" alt="스크린샷 2022-04-25 오후 5 14 40" src="https://user-images.githubusercontent.com/79198426/165048284-8ab5a828-307c-4dac-9295-d446330e3851.png">

<br>

<b>Product fetch</b>
<br>
Youth&Luxury는 중고 명품을 쉽고 상태를 빠르게 파악하기 위해 한눈에 상품에 관련된 모든 정보를 확인할수 있어야합니다. 상품에 관련된 정보를 다른 테이블에서 가져오기 위해 querybuilder를 사용하여 
직접적으로 연결되지 않은 테이블과 연결을 성공시켰습니다. querybuilder를 이용하여 연결한 테이블들은 fetch가 가능해져 필요한 데이터들을 가져올수 있게 하였습니다.


<img width="1279" alt="스크린샷 2022-04-25 오후 4 23 35" src="https://user-images.githubusercontent.com/79198426/165040172-9be1ad90-dcd9-4ac3-a62f-6130784b748c.png">

# Jest를 활용한 User 생성 unit test

회원가입시 생성되는 유저를 담당하는 api에 대한 간단한 unit test를 실시하여 추후에 있을 테스트에 시간 절약을 꾀했습니다.

```
describe('UserService', () => {
    let userService : UserService;

    beforeEach(async () => {
        const userModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: MockUserRepository,
                },
                {
                    provide: CACHE_MANAGER,
                    useFactory: jest.fn(),
                },
            ],
        }).compile()

        userService = userModule.get<UserService>(UserService)
    })

    describe('create', () => {
        it('회원가입', async () => {
            const myDB = {
                email:'jyjjyj06@naver.com',
                password:"1234",
                name:"양진영",
                phoneNum:'01011112222',
                nickname:"hahaha"
            }
            try{
                const {email, password, name, phoneNum, nickname} = myDB
                const hashedPassword = await bcrypt.hash(password, 5);
                userService.create({email, hashedPassword, name, phoneNum, nickname})
            } catch(error){
                expect(error).toBeInstanceOf(ConflictException)
            }
        })
    })
})
```
<img width="382" alt="스크린샷 2022-04-26 오후 5 52 01" src="https://user-images.githubusercontent.com/79198426/165261921-a16c2c57-d547-49ad-903a-d4bfb6fcd0e3.png">
<br>

# Loadbalancing을 통한 부하분산 구성과 보안을 위한 https설정을 완료한 배포
1. GCP를 이용하여 배포를 하였습니다. 
2. 배포시 서비스의 안정성과 보안성을 강화하여 트래픽이 몰렸을시 하나의 서버에 과한 부하를 막기 위해 배포되었던 인스턴스들을 그룹으로 묶었습니다.
3. 그룹화 한 인스턴스와 로드밸런스를 연결하여 round-robin 방식으로 트래픽을 분산했습니다.
4. 로드밸런스를 기준 백엔드를 TCP 3000으로 연결하고 주기적으로 health-checking할수있게 설정해두었습니다.
5. 로드밸런스를 기준 프론트엔드를 https 로 설정하고 구글에서 지원하는 ssl을 사용하여 보안을 강화하였습니다.
6. DNS와 로드밸런스를 연결하여 클라이언트로 받아오는 트래픽을 로드밸런스가 인스턴스 그룹에 부하분산 할 수 있도록 설정했습니다.

## 배포 flow chart

<img width="958" alt="스크린샷 2022-04-26 오후 6 36 17" src="https://user-images.githubusercontent.com/79198426/165270645-34b4412d-74a9-4bfb-8591-dff92a68baf8.png">



## 실제 설정 스크린샷
<img width="571" alt="스크린샷 2022-04-26 오후 5 58 52" src="https://user-images.githubusercontent.com/79198426/165267282-927cce0f-c7c2-41c4-abc3-4e5d749496bd.png">


![스크린샷 2022-04-26 오후 6 20 51](https://user-images.githubusercontent.com/79198426/165267634-e43954f7-6f42-47ee-ae71-48926ca834ce.png)




![스크린샷 2022-04-26 오후 6 21 38](https://user-images.githubusercontent.com/79198426/165267896-90e52d70-7b2a-4f94-9427-ab7462e26d53.png)





