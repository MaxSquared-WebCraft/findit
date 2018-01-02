import { Get, JsonController, Post, UploadedFile } from "routing-controllers";
import { Inject } from "typedi";
import { AwsUploadServiceImpl } from "../services/awsUploadServiceImpl";

export interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

export interface IFileUploadService {
  upload: (file: MulterFile) => Promise<any>
}

@JsonController('/file')
export class FileController {

  @Inject(AwsUploadServiceImpl)
  uploadService: IFileUploadService;

  @Post('/')
  async addFile(@UploadedFile("document") file: MulterFile) {
    return this.uploadService.upload(file);
  }

  @Get('/')
  getFile() {
    return { blah: 1234 }
  }
}