import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('image')
  async uploadImage(@UploadedFile() image: Express.Multer.File) {
    return await this.fileService.uploadImage(image);
  }
}
