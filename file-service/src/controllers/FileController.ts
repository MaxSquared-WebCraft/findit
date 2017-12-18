import { Get, JsonController, Post, UploadedFile } from "routing-controllers";

@JsonController()
export class FileController {

  @Post()
  addFile(@UploadedFile("document") file: any) {

  }

  @Get()
  getFile() {

  }
}