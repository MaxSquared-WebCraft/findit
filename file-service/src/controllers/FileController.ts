import { Get, HeaderParam, JsonController, Param, Post, UploadedFile } from "routing-controllers";
import { Inject } from "typedi";
import { Document } from "../entities/Document";
import {AwsUploadServiceImpl} from '../services/AwsUploadServiceImpl';

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface IFileUploadService {
  upload: (file: MulterFile, userId: string) => Promise<any>
  getFiles: (id: string) => Promise<Document[]>
}

@JsonController('/file')
export class FileController {

  @Inject(AwsUploadServiceImpl)
  uploadService: IFileUploadService;

  @Post('/')
  async addFile(@UploadedFile("document") file: MulterFile,
                @HeaderParam("userId") userId: string) {
    return this.uploadService.upload(file, userId);
  }

  @Get('/:id')
  getFile(@Param('id') id: string) {
    return this.uploadService.getFiles(id)
  }
}