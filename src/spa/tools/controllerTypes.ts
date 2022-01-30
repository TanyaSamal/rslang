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
  name: string;
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

interface IUserWordOptions {
  status: string  // изучено, сложное? сделать Type?
}

export interface IUserWord {
  difficulty: string,
  optional?: IUserWordOptions
}
