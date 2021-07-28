import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallangeStatus } from '../enums/challangeStatus.enum';

export class ChallangeStatusValidationPipe implements PipeTransform {
  readonly statusPermitidos = [
    ChallangeStatus.ACCEPTED,
    ChallangeStatus.DENIED,
    ChallangeStatus.CANCELED,
  ];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.ehStatusValido(status)) {
      throw new BadRequestException(`${status} is an invalid status`);
    }
    return value;
  }

  private ehStatusValido(status: any) {
    const idx = this.statusPermitidos.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}
