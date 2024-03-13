export enum SalePlace {
  SellerCity = 'seller_city',
  RF = 'RF',
}

export enum WorkingModel {
  FBO = 'FBO',
  FBS = 'FBS',
}

export class SurveyAnswer {
  constructor({ pgDoc }: { pgDoc: any }) {
    this.region = pgDoc.region;
    this.city = pgDoc.city;
    this.salePlace = pgDoc.salePlace;
    this.mandatoryCertification = pgDoc.mandatoryCertification;
    this.productCategory = pgDoc.productCategory;
    this.workingModel = pgDoc.workingModel;
    this.sellingOtherMarketplace = pgDoc.sellingOtherMarketplace;
  }

  region: string;
  city: string;
  salePlace: SalePlace;
  mandatoryCertification: boolean;
  productCategory: string[];
  workingModel: WorkingModel;
  sellingOtherMarketplace: boolean;
}
