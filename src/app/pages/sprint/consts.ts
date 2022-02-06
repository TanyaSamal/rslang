const MIN_PAGE: number = 0;
const MAX_PAGE: number = 29;
const DELAY: number = 8;
const SECTOR: number[] = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
const BASE_URL: string = 'https://rslang-2022.herokuapp.com/';
const START_NUMBER_CARD: number = 0;
const MAX_LENGTH_ARRAY_TRANSLATE: number = 6;
const TIMER: number = 60;

const CURRENT_CARD: string = 'current_card';
const TRUE_TRANSLATE: string = 'true_translate';
const CURRENT_TRANSLATE: string = 'current_translate';
const ANSWER: string = 'sprint_answer';
const TRUE: string = 'true';
const FALSE: string = 'false';
const WORDS: string = 'words';
const WORDS_TRANSLATE: string = 'words_translate';

enum KEYS {
    arrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
}

enum COLOR_SHADOW {
    red = '#e91212',
    green = 'green',
}

export default {
    MIN_PAGE,
    MAX_PAGE,
    DELAY,
    SECTOR,
    BASE_URL,
    START_NUMBER_CARD,
    MAX_LENGTH_ARRAY_TRANSLATE,
    TIMER,
    CURRENT_CARD,
    TRUE_TRANSLATE,
    CURRENT_TRANSLATE,
    ANSWER,
    TRUE,
    FALSE,
    KEYS,
    COLOR_SHADOW,
    WORDS,
    WORDS_TRANSLATE,
};