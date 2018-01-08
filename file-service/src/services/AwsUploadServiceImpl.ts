import { IFileUploadService, MulterFile } from "../controllers/FileController";
import { Service, Token } from "typedi";
import * as config from 'config'
import * as S3 from 'aws-sdk/clients/s3'
import * as uuidv4 from 'uuid/v4'
import { ProducerFactory } from "../events/ProducerFactory";
import { Producer } from "kafka-node";

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

  private static getMulterFileType(file: MulterFile) {
    const { mimetype } = file;
    return mimetype.substring(mimetype.indexOf('/') + 1)
  }

  async upload(file: MulterFile) {

    const res = await this.s3client.upload({
      Bucket: this.s3config.bucket,
      Key: `${uuidv4()}.${AwsImpl.getMulterFileType(file)}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read'
    }).promise();

    this.producer.send([{
      topic: 'FILE_UPLOADED',
      messages: ['file uploaded']
    }], (err, data) => {
      if (err) return console.error('error', err);
      console.log('sent', data);
    });

    return res;
  };
}