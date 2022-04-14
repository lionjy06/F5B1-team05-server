import {
    ConflictException,
    Injectable,
    UnprocessableEntityException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import axios from 'axios';

  import { Connection, Repository } from 'typeorm';
  import {
    Transaction,
    TRANSACTION_STATUS_ENUM,
  } from "../transaction/entities/transaction.entity"
  
  
  import { User } from '../user/entities/user.entity';

  @Injectable()
export class IamportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async getToken({ impUid }) {
    
    const token = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: process.env.IMP_KEY,
      imp_secret:
        process.env.IMP_SECRET,
    });
    const { access_token } = token.data.response;
    
    const useToken = await axios.get(
      `https://api.iamport.kr/payments/${impUid}`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const { imp_uid } = useToken.data.response;
    if (imp_uid !== impUid)
      throw new UnprocessableEntityException('존재하지 않는 데이터 입니다.');
    const doubleCheckImpUid = await this.transactionRepository.findOne({
      impUid,
    });
    if (doubleCheckImpUid)
      throw new ConflictException('이미 결제된 결재 아이디입니다.');
  }

  async cancle({ impUid }) {
    const isIMP = await this.transactionRepository.findOne({ impUid });
    const { status, id, createdAt,amount, ...rest } = isIMP;

    const token = await axios.post('https://api.iamport.kr/users/getToken', {
      imp_key: process.env.IMP_KEY,
      imp_secret: process.env.IMP_SECRET,
    });

    const { access_token } = token.data.response;

    const getCancelData = await axios.post(
      'https://api.iamport.kr/payments/cancel',
      {
        imp_uid: impUid,
      },
      {
        headers: {
          Authorization: access_token,
        },
      },
    );
    const { response } = getCancelData.data;
    if (status === 'PAYMENT' || status === "EXAMINATION") {
      const cancleUpdate = await this.transactionRepository.create({
        impUid,
        createdAt,
        amount:-amount,
        status: TRANSACTION_STATUS_ENUM.CANCEL,
        ...rest,
      });
      const canclePayment = await this.transactionRepository.findOne({
        impUid,
      });
      if (canclePayment)
        throw new UnprocessableEntityException('이미 취소된건 입니다.');
      await this.transactionRepository.save(cancleUpdate);
    }
  }

  async update({impUid,statusCode}){
    const order = await this.transactionRepository.findOne({where:{impUid}})
    const { status, ...rest } = order
    if(order.status !== 'CANCEL'){
        let statusEnum:TRANSACTION_STATUS_ENUM;
            if (statusCode === "PAYMENT") statusEnum = TRANSACTION_STATUS_ENUM.PAYMENT;
            else if(statusCode === "EXAMINATION") statusEnum = TRANSACTION_STATUS_ENUM.EXAMINATION;
            else if(statusCode === "ONTHEWAY") statusEnum = TRANSACTION_STATUS_ENUM.ONTHEWAY;
            else if(statusCode === "DELIVERED") statusEnum = TRANSACTION_STATUS_ENUM.DELIVERED;
            else {
                console.log("없는 ENUM 입니다.");
                throw new ConflictException("적절한 OrderEnum이 아닙니다");}
        const newOrder = await this.transactionRepository.create({
            status:statusEnum,
            ...rest
        })
        const result = await this.transactionRepository.save(newOrder)
        return result
    }
  }
}