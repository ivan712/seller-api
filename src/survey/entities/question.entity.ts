export class SurveyQuestion {
  constructor({ pgDoc }: { pgDoc: any }) {
    this.id = String(pgDoc.id);
    this.question = pgDoc.question;
  }

  id: string;
  question: string;
}
