import { ChallangeStatus } from '../enums/challangeStatus.enum';
import { IsOptional } from 'class-validator';

export class UpdateChallengeGameDTO {
  @IsOptional()
  //@IsDate()
  dateTimeChallenge: Date;

  @IsOptional()
  status: ChallangeStatus;
}
