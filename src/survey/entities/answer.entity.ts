export class SurveyAnswer {
  constructor({ pgDoc }: { pgDoc: any }) {
    this.questionId = pgDoc.questionId;
    this.question = pgDoc.surveyQuestion.question;
    this.answer = pgDoc.answer;
  }

  questionId: number;
  question?: string;
  answer: string;
}
