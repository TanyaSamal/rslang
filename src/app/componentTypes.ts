import { IWord, WordStatus } from "../spa/tools/controllerTypes";

export enum Mode {
  DICTIONARY = 'dictionary',
  TEXTBOOK = 'textbook'
}

export interface IGameState {
  mode: Mode,
  state: WordStatus,
  level: string,
  textbookPage: number,
  dictionaryPage: number,
  textbookWords: IWord[],
  dictionaryWords: IWord[]
}

export interface IGameStatistic {
  date: string,
  longest: number,
  rightAnswers: number,
  totalAnswers: number,
  newWords: number
}

export interface IGamePoints {
  userId: string,
  points: string,
  date: string
}

export type IPageState = Omit<IGameState, 'textbookWords' | 'dictionaryWords'>
