import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class NftsValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!value) throw new BadRequestException();

    if (value.id || value.contractId || value.owner) {
      if (value.id && !value.id.includes('::'))
        throw new BadRequestException('invalid fully qualified nft id');
    }

    if (value && metadata.type === 'param' && metadata.data === 'id')
      if (!value.includes('::'))
        throw new BadRequestException('invalid fully qualified nft id');

    return value;
  }
}
