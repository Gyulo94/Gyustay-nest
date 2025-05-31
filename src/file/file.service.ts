import { Injectable } from '@nestjs/common';
import { ErrorCode } from 'src/common/enum/error-code.enum';
import { ApiException } from 'src/common/exception/api.exception';

@Injectable()
export class FileService {
  uploadImage(image: Express.Multer.File) {
    if (!image) {
      throw new ApiException(ErrorCode.IMAGE_NOT_FOUND);
    }
    const fileUrl = `${process.env.SERVER_URL}/uploads/temp/${image.filename}`;
    return fileUrl;
  }
}
