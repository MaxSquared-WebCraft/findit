import { IFileUploadService } from "./fileUploadService";
import { Service, Token } from "typedi";

export const AwsUploadServiceImpl = new Token<IFileUploadService>();

@Service(AwsUploadServiceImpl)
export class AwsImpl implements IFileUploadService {
  upload: (file: File) => Promise<any>;
}