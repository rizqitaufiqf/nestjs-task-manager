import { BadRequestException, PipeTransform } from '@nestjs/common';
import validator from 'validator';

export class UuidValidationPipe implements PipeTransform {
  transform(value: any): any {
    if (!validator.isUUID(value)) {
      throw new BadRequestException(`"${value}" is an invalid id`);
    }
    return value;
  }
}
