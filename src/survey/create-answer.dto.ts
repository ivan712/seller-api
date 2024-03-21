import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsString,
} from 'class-validator';
import { SalePlace, WorkingModel } from './answer.entity';

export class CreateAnswerDto {
  @IsString()
  region: string;

  @IsString()
  city: string;

  @IsEnum(SalePlace)
  salePlace: SalePlace;

  @IsBoolean()
  mandatoryCertification: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  productCategory: string[];

  @IsEnum(WorkingModel)
  workingModel: WorkingModel;

  @IsBoolean()
  experienceOnOthersMarketplaces: boolean;
}
