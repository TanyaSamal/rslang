const SPRINT_STATE: string = 'sprintState';
const MIN_PAGE: number = 0;
const MAX_PAGE: number = 29;

const GROUP: string = 'group';
const PAGE: string = 'page';
const BONUS_STAR: string = 'bonus_star';
const BONUS_MEDAL: string = 'bonus_medal';
const SCORE: string = 'score';
const AUDIO_MUTE: string = 'audio_mute';

enum BONUS_STAR_MEDAL {
    minStar = 0,
    maxStar = 3,
    minMedal = 0,
    maxMedal = 4,
}

export default {
    SPRINT_STATE,
    MIN_PAGE,
    MAX_PAGE,
    GROUP,
    PAGE,
    BONUS_STAR,
    BONUS_MEDAL,
    BONUS_STAR_MEDAL,
    SCORE,
    AUDIO_MUTE
};