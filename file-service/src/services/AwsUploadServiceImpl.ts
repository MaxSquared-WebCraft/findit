import { IFileUploadService, MulterFile } from "../controllers/FileController";
import { Service, Token } from "typedi";
import * as config from 'config'
import * as S3 from 'aws-sdk/clients/s3'
import * as uuidv4 from 'uuid/v4'
import { ProducerFactory } from "../events/ProducerFactory";
import { Producer } from "kafka-node";
import { PutObjectRequest } from "aws-sdk/clients/s3";

interface S3Options {
  accessKeyId: string,
  secretAccessKey: string,
  bucket: string,
  region: string,
}

export const AwsUploadServiceImpl = new Token<IFileUploadService>();

@Service(AwsUploadServiceImpl)
export class AwsImpl implements IFileUploadService {

  private producer: Producer;

  private s3config: S3Options;
  private s3client: S3;

  constructor(private producerFactory: ProducerFactory) {
    this.s3config = config.get('s3');
    this.s3client = new S3(this.s3config);
    this.producer = this.producerFactory.getProducer()
  }

  private static getMulterFileType = (file: MulterFile) => {
    const { mimetype } = file;
    return mimetype.substring(mimetype.indexOf('/') + 1)
  };

  private s3upload = (params: PutObjectRequest) => {
    return this.s3client.upload(params).promise()
  };

  public upload = async (file: MulterFile, userId: string) => {

    const uuid = uuidv4();
    const params = {
      Bucket: this.s3config.bucket,
      Key: `${uuid}.${AwsImpl.getMulterFileType(file)}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    };

    const res = await this.s3upload(params);

    const payloads = [{
      topic: 'FILE_UPLOADED',
      messages: JSON.stringify({
        location: res.Location,
        fileUuid: uuid,
        userId,
      })
    }];

    ProducerFactory.sendProducerEvent(this.producer, payloads);

    return res;
  };
}