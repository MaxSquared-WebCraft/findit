import { IFileUploadService, MulterFile } from "../controllers/FileController";
import { Service, Token } from "typedi";
import * as config from 'config'
import * as S3 from 'aws-sdk/clients/s3'
import * as uuidv4 from 'uuid/v4'
import { UtilService } from "./utilService";

interface S3Options {
  accessKeyId: string,
  secretAccessKey: string,
  bucket: string,
  region: string,
}

export const AwsUploadServiceImpl = new Token<IFileUploadService>();

@Service(AwsUploadServiceImpl)
export class AwsImpl implements IFileUploadService {

  private s3config: S3Options;
  private s3client: S3;

  constructor() {
    this.s3config = config.get('s3');
    this.s3client = new S3(this.s3config)
  }

  upload(file: MulterFile) {
    return this.s3client.upload({
      Bucket: this.s3config.bucket,
      Key: `${uuidv4()}.${UtilService.getFileType(file)}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }).promise();
  };
}