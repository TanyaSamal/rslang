const MIN_PAGE: number = 0;
const MAX_PAGE: number = 29;
const DELAY: number = 8;
const SECTOR: number[] = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
const BASE_URL: string = 'https://rslang-2022.herokuapp.com/';
const START_NUMBER_CARD: number = 0;
const MAX_LENGTH_ARRAY_TRANSLATE: number = 6;
const TIMER: number = 60;
const START_BONUS_POINTS: number = 10;

const CURRENT_CARD: string = 'current_card';
const TRUE_TRANSLATE: string = 'true_translate';
const CURRENT_TRANSLATE: string = 'current_translate';
const ANSWER: string = 'sprint_answer';
const TRUE: string = 'true';
const FALSE: string = 'false';
const WORDS: string = 'words';
const WORDS_TRANSLATE: string = 'words_translate';
const AUDIO_WORD: string = 'audio_word';
const GROUP: string = 'group';
const PAGE: string = 'page';
const BONUS_STAR: string = 'bonus_star';
const BONUS_MEDAL: string = 'bonus_medal';
const BONUS_POINTS: string = 'bonus_points';
const SCORE: string = 'score';
const SPRINT_STATE: string = 'sprintState';
const AUDIO_MUTE: string = 'audio_mute';

enum KEYS {
    arrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
}

enum COLOR_SHADOW {
    red = '#e91212',
    green = 'green',
}

enum BONUS_STAR_MEDAL {
    minStar = 0,
    maxStar = 3,
    minMedal = 0,
    maxMedal = 4,
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
    GROUP,
    PAGE,
    BONUS_STAR,
    BONUS_MEDAL,
    BONUS_STAR_MEDAL,
    START_BONUS_POINTS,
    BONUS_POINTS,
    SCORE,
    SPRINT_STATE,
    AUDIO_WORD,
    AUDIO_MUTE,
};