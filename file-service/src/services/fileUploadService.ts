import { Inject, Service } from "typedi";
import { AwsUploadServiceImpl } from "./awsUploadServiceImpl";

export interface IFileUploadService {
  upload: (file: File) => Promise<any>
}

@Service()
export class FileUploadService {

  @Inject(AwsUploadServiceImpl)
  upload: IFileUploadService;

  getUploadOptions: () => {

  }

}