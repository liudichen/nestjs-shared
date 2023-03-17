import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import type {
  FastifyBufferFile,
  FastifyDiskFile,
} from '@iimm/fastify-multipart';

/**校验文件是否超出限度的pipe */
@Injectable()
export class ValidateFastifyFilesOverLimitPipe implements PipeTransform {
  transform(
    value: FastifyBufferFile[] | FastifyDiskFile[],
    metadata: ArgumentMetadata,
  ) {
    const { data } = metadata;
    if (
      value?.length &&
      value.some((ele: FastifyBufferFile | FastifyBufferFile) => ele.limit)
    ) {
      throw new HttpException(
        `${data ? `${data}字段中` : ''}上传的文件中存在文件大小超出限度`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
