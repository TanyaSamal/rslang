const MIN_PAGE: number = 0;
const MAX_PAGE: number = 29;
const DELAY: number = 8;
const SECTOR: number[] = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
const BASE_URL: string = 'https://rslang-2022.herokuapp.com/';
const START_NUMBER_CARD: number = 0;
const MAX_LENGTH_ARRAY_TRANSLATE: number = 6;
const TIMER: number = 60;
const START_BONUS_POINTS: number = 1;

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
const BEST_SCORE: string = 'best_score';
const SPRINT_STATE: string = 'sprintState';
const AUDIO_MUTE: string = 'audio_mute';
const GAME_SPRINT_STATISTIC: string = 'game_sprint_statistic';
const WORD_ENG: string = 'word_eng';
const TIMER_ID_SPRINT: string = 'timer_id_sprint';

const NAME_COUNT_WORDS: string[] = ['слово', 'слова', 'слов'];
const NAME_COUNT_POINTS: string[] = ['балл', 'балла', 'баллов'];

enum KEYS {
    arrowLeft = 'ArrowLeft',
    ArrowRight = 'ArrowRight',
}

enum COLOR_SHADOW {
    red = '#e91212',
    green = 'green',
}

enum COLOR_DIAGRAMM {
    old = '#0f66dd',
    new = '#599106',
}

enum BONUS_STAR_MEDAL {
    minStar = 0,
    maxStar = 3,
    minMedal = 0,
    maxMedal = 4,
}

enum CITATION {
    first = 'Это хорошее начало',
    one = 'Стабильность – признак мастерства!',
    two = 'Я знаю, что ты можешь лучше!',
    three = 'Молодец, так держать!',
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
    BEST_SCORE,
    SPRINT_STATE,
    AUDIO_WORD,
    AUDIO_MUTE,
    GAME_SPRINT_STATISTIC,
    WORD_ENG,
    TIMER_ID_SPRINT,
    COLOR_DIAGRAMM,
    CITATION,
    NAME_COUNT_WORDS,
    NAME_COUNT_POINTS
};