export type Bonus = {
    star: number;
    medal: number;
}

export type WordAnswer = {
    eng: string;
    rus: string;
    audioURL: string;
}

export type WordStorage = WordAnswer[];

export interface IGameStatistic {
    longest: number,
    rightAnswers: number,
    totalAnswers: number,
    newWords: number
}

export interface IGameSprintStatistic {
    score: number,
    rightAnswers: number,
    falseAnswers: number,
    rightWords: WordAnswer[],
    falseWords: WordAnswer[],
}
