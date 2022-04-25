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
  - socket.io를 통한 실시간 통신
  - Loadbalancing을 통한 부하분산 구성과 보안을 위한 https설정을 완료한 배포
  - 주요서비스에 사용되는 API에 대한 jest를 활용한 Unit test   

<br>

ERD 및 API소개
---
<b>ERD</b>

![스크린샷 2022-04-15 오전 3 05 55](https://user-images.githubusercontent.com/79198426/165026240-e6307085-460e-45f2-9e17-23442aa6ea45.png)

* 테이블안의 중복되는 데이터를 줄이기 위해 정규화를 고려하여 테이블을 분리하였습니다.

<b>API 명세서</b>


<br>
API개발 및 권한
---

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

<b>Product fetch</b>
<br>
Youth&Luxury는 중고 명품을 쉽고 상태를 빠르게 파악하기 위해 한눈에 상품에 관련된 모든 정보를 확인할수 있어야합니다. 상품에 관련된 정보를 다른 테이블에서 가져오기 위해 querybuilder를 사용하여 
직접적으로 연결되지 않은 테이블과 연결을 성공시켰습니다. querybuilder를 이용하여 연결한 테이블들은 fetch가 가능해져 필요한 데이터들을 가져올수 있게 하였습니다.


<img width="1279" alt="스크린샷 2022-04-25 오후 4 23 35" src="https://user-images.githubusercontent.com/79198426/165040172-9be1ad90-dcd9-4ac3-a62f-6130784b748c.png">

     
      
