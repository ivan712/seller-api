import { IsNumber, IsString } from 'class-validator';

export class CreateAnswerDto {
  @IsNumber()
  questionId: number;

  @IsString()
  answer: string;
}
