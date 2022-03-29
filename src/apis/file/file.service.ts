import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import * as dotenv from 'dotenv';
import { resolve } from 'path/posix';
import { rejects } from 'assert';

dotenv.config();
interface IUpload {
  files: FileUpload[];
}

@Injectable()
export class FileService {
  async upload({ files }: IUpload) {
    // // 스토리지에 이미지 업로드 작업을 하는 함수
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME, //key filename을 소유함으로서 권한을 갖게된다
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);

    //일단 파일들을 먼저 받아야함
    const waitedFiles = await Promise.all(files);

    //받은 이미지들을 구글 스토리지에 올리기
    const urls = await Promise.all(
      waitedFiles.map((file) => {
        return new Promise((resolve, reject) => {
          file
            .createReadStream()
            .pipe(storage.file(file.filename).createWriteStream())
            .on('finish', () => {
              resolve(`${process.env.STORAGE_BUCKET}/${file.filename}`);
            })
            .on('error', (error) => reject(error));
        });
      }),
    );

    return urls;
  }
}
