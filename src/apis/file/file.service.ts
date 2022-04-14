import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import { Storage } from '@google-cloud/storage';
import * as dotenv from 'dotenv';
import { resolve } from 'path/posix';
import { rejects } from 'assert';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';

dotenv.config();
interface IUpload {
  files: FileUpload[];
}

 

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>
  ){}
  async upload({ files }: IUpload) {
  
    
    const storage = new Storage({
      keyFilename: process.env.STORAGE_KEY_FILENAME, 
      projectId: process.env.STORAGE_PROJECT_ID,
    }).bucket(process.env.STORAGE_BUCKET);

    
    const waitedFiles = await Promise.all(files);
    
    
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
            console.log(`${process.env.STORAGE_BUCKET}/${file.filename}`)
        });
      }),
    );

     
     await this.fileRepository.save({urls:JSON.stringify(urls)});
     return  JSON.stringify(urls) 
  }
}
