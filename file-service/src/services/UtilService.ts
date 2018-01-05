import { MulterFile } from "../controllers/FileController";

export class UtilService {

  static getMulterFileType(file: MulterFile) {
    const { mimetype } = file;
    return UtilService.getFileType(mimetype)
  }

  static getFileType(mimetype: string) {
    return mimetype.substring(mimetype.indexOf('/') + 1)
  }

}


