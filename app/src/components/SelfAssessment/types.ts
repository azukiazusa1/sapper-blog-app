export type Quiz = {
  question: string;
  answers: Answer[];
};

export type Answer = {
  text: string;
  correct: boolean;
  explanation?: string;
};
