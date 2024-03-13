export class SurveyQuestion {
  constructor({ pgDoc }: { pgDoc: any }) {
    this.id = pgDoc.id;
    this.question = pgDoc.question;
  }

  id: string;
  question: string;
}
