import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { File } from './entities/file.entity';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Mutation(() => [File])
  async uploadFile(
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
  ) {
    
    return await this.fileService.upload({ files });
    
  }
}
