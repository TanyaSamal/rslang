const MIN_PAGE = 0;
const MAX_PAGE = 29;
const DELAY = 8;
const SECTOR: number[] = [0, 12.5, 25, 37.5, 50, 62.5, 75, 87.5, 100];
const BASE_URL = 'https://rslang-2022.herokuapp.com/';
const START_NUMBER_CARD = 0;
const MAX_LENGTH_ARRAY_TRANSLATE = 6;
const TIMER = 60;
const START_BONUS_POINTS = 1;

const CURRENT_CARD = 'current_card';
const TRUE_TRANSLATE = 'true_translate';
const CURRENT_TRANSLATE = 'current_translate';
const ANSWER = 'sprint_answer';
const TRUE = 'true';
const FALSE = 'false';
const WORDS = 'words';
const WORDS_TRANSLATE = 'words_translate';
const AUDIO_WORD = 'audio_word';
const GROUP = 'group';
const PAGE = 'page';
const BONUS_STAR = 'bonus_star';
const BONUS_MEDAL = 'bonus_medal';
const BONUS_POINTS = 'bonus_points';
const SCORE = 'score';
const BEST_SCORE = 'best_score';
const SPRINT_STATE = 'sprintState';
const AUDIO_MUTE = 'audio_mute';
const GAME_SPRINT_STATISTIC = 'game_sprint_statistic';
const GAME_AUDIOCALL_STATISTIC = 'game_audiocall_statistic';
const WORD_ENG = 'word_eng';
const TIMER_ID_SPRINT = 'timer_id_sprint';
const TIMER_ID_START_GAME = 'timer_id_start_game';
const SPRINT_STATISTIC = 'sprintStatistic';
const WORD_STORAGE = 'word_storage';
const SPRINT_POINTS = 'sprintPoints';
const SPRINT_WORD_ID = 'sprint_word_id';
const SPRINT_NEW_WORDS = 'sprint_new_words';

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
    old = '#b8eee1',
    new = '#21977c',
}

enum BONUS_STAR_MEDAL {
    minStar = 0,
    maxStar = 3,
    minMedal = 0,
    maxMedal = 4,
}

enum CITATION {
    first = 'Это хорошее начало!',
    one = 'Не растраивайся, 0 - тоже результат:)',
    two = 'Я знаю, что ты можешь лучше!',
    three = 'Молодец, так держать!',
}

enum URL_SOUND {
    time = 'https://github.com/dns147/mp3-rs/raw/main/mp3-rs-lang/time.mp3',
    click = 'https://github.com/dns147/mp3-rs/raw/main/mp3-rs-lang/click.mp3',
    end = 'https://github.com/dns147/mp3-rs/raw/main/mp3-rs-lang/end.mp3',
    falseAnswer = 'https://github.com/dns147/mp3-rs/raw/main/mp3-rs-lang/false-answer.mp3',
    rightAnswer = 'https://github.com/dns147/mp3-rs/raw/main/mp3-rs-lang/right-answer.mp3'
}

const SOUND_TIME = new Audio(URL_SOUND.time);
SOUND_TIME.setAttribute('loop', 'loop');
const SOUND_CLICK = new Audio(URL_SOUND.click);
const SOUND_END = new Audio(URL_SOUND.end);
const SOUND_FALSE_ANSWER = new Audio(URL_SOUND.falseAnswer);
const SOUND_RIGHT_ANSWER = new Audio(URL_SOUND.rightAnswer);

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
    GAME_AUDIOCALL_STATISTIC,
    WORD_ENG,
    TIMER_ID_SPRINT,
    TIMER_ID_START_GAME,
    COLOR_DIAGRAMM,
    CITATION,
    NAME_COUNT_WORDS,
    NAME_COUNT_POINTS,
    SPRINT_STATISTIC,
    SOUND_TIME,
    SOUND_CLICK,
    SOUND_END,
    SOUND_FALSE_ANSWER,
    SOUND_RIGHT_ANSWER,
    WORD_STORAGE,
    SPRINT_POINTS,
    SPRINT_WORD_ID,
    SPRINT_NEW_WORDS
};
