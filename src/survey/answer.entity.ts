import { SurveyAnswer as SurveyAnswerModel } from '@prisma/client';

export enum SalePlace {
  SellerCity = 'seller_city',
  RF = 'RF',
}

export enum WorkingModel {
  FBO = 'FBO',
  FBS = 'FBS',
}

export class SurveyAnswer {
  constructor({ pgDoc }: { pgDoc: SurveyAnswerModel }) {
    this.region = pgDoc.region;
    this.city = pgDoc.city;
    this.salePlace = pgDoc.salePlace as SalePlace;
    this.mandatoryCertification = pgDoc.mandatoryCertification;
    this.productCategory = pgDoc.productCategory;
    this.workingModel = pgDoc.workingModel as WorkingModel;
    this.experienceOnOthersMarketplaces = pgDoc.experienceOnOthersMarketplaces;
  }

  region: string;
  city: string;
  salePlace: SalePlace;
  mandatoryCertification: boolean;
  productCategory: string[];
  workingModel: WorkingModel;
  experienceOnOthersMarketplaces: boolean;
}
