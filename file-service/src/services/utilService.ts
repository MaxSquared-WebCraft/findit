import { MulterFile } from "../controllers/FileController";

export class UtilService {

  static getFileType(file: MulterFile) {
    const { mimetype } = file;
    return mimetype.substring(mimetype.indexOf('/') + 1)
  }

}


