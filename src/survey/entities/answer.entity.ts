export class SurveyAnswer {
  //   constructor({ pgDoc }: { pgDoc: any }) {
  //     this.id = String(pgDoc.id);
  //     this.question = pgDoc.question;
  //   }

  id: number;
  questionId: string;
  question?: string;
  answer: string;

  getWithoutQuestion() {
    return {
      id: this.id,
      questionId: this.questionId,
      answer: this.answer,
    };
  }

  getWithQuestion() {
    return { ...this.getWithoutQuestion(), question: this.question };
  }
}
