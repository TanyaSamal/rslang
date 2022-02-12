export type WordAnswer = {
  eng: string;
  rus: string;
  audioURL: string;
}

export interface IGameAudiocallStatistic {
  score: number,
  rightAnswers: number,
  falseAnswers: number,
  rightWords: WordAnswer[],
  falseWords: WordAnswer[],
}
