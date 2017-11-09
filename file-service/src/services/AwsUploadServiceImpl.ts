import { IFileUploadService, IMulterFile } from "../controllers/FileController";
import { Inject, Service, Token } from "typedi";
import * as S3 from "aws-sdk/clients/s3"
import * as uuidv4 from "uuid/v4"
import { ProducerFactory } from "../events/ProducerFactory";
import { Producer } from "kafka-node";
import { PutObjectRequest } from "aws-sdk/clients/s3";
import { OrmConnection } from "typeorm-typedi-extensions";
import { Connection, Repository } from "typeorm";
import { User } from "../entities/User";
import { Document } from "../entities/Document";
import { WinstonLoggerImpl } from "../common/WinstonLoggerImpl";
import { ILogger } from "../config/Application";

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  bucket: process.env.AWS_BUCKET,
  region: process.env.AWS_REGION
};

export const AwsUploadServiceImpl = new Token<IFileUploadService>();

@Service(AwsUploadServiceImpl)
export class AwsImpl implements IFileUploadService {

  private readonly producer: Producer;
  private s3client: S3;
  private userRepository: Repository<User>;

  constructor(@OrmConnection() private readonly connection: Connection,
              @Inject(WinstonLoggerImpl) private readonly logger: ILogger,
              private readonly producerFactory: ProducerFactory) {

    this.s3client = new S3(config);
    this.producer = this.producerFactory.getProducer();

    this.userRepository = connection.getRepository(User);
  }

  private static getMulterFileType = (file: IMulterFile) => {
    const { mimetype } = file;
    return mimetype.substring(mimetype.indexOf("/") + 1);
  };

  private s3upload = (params: PutObjectRequest) => {
    return this.s3client.upload(params).promise();
  };

  public upload = async (file: IMulterFile, userId: string) => {

    const uuid = uuidv4();
    const params = {
      Bucket: config.bucket,
      Key: `${uuid}.${AwsImpl.getMulterFileType(file)}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read"
    };

    const res = await this.s3upload(params);

    const payloads = [{
      topic: "FILE_UPLOADED",
      messages: JSON.stringify({
        location: res.Location,
        fileUuid: uuid,
        originalname: file.originalname,
        userId,
      })
    }];

    this.producerFactory.sendProducerEvent(this.producer, payloads);

    return res;
  };

  public getFiles = async (id: string): Promise<Document[]> => {
    const user = await this.userRepository.findOne({ relations: ["documents"], where: { uuid: id } });
    return user.documents;
  };
}
