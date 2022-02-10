export enum WordStatus {
  learnt = 'learnt',
  difficult = 'difficult',
  inProgress = 'inProgress'
}

export enum UrlPath {
  USERS = 'users',
  WORDS = 'words',
  SIGNIN = 'signin',
  TOKENS = 'tokens',
  AGREGATED = 'aggregatedWords'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT'
}

export interface IUser {
  name?: string;
  email: string;
  password: string
}

export interface IAuth {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name?: string;
}

export interface IWord {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
  [key: string]: string | number;
}

export interface IUserWordOptions {
  updatedDate: string;  // для статистики
  status: WordStatus; // для словаря
  gameProgress: { // для карточки слова
    sprint: {
      right: number;
      wrong: number;
    };
    audiocall: {
      right: number;
      wrong: number;
    };
  }
}

export interface IUserWord {
  difficulty: string, // 0-6 для определения уровня
  optional?: IUserWordOptions
}

export interface IUserWordInfo {
  difficulty: string;
  id: string;
  optional?: IUserWordOptions;
  wordId: string;
}
