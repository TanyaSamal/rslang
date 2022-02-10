import Controller from "../../../spa/tools/controller";
import { IWord } from "../../../spa/tools/controllerTypes";
import CONSTS from "./sprintConsts";
import { Bonus } from "./sprintTypes";

function getGroup(): string {
    const level = document.querySelector('.click-level') as HTMLElement;
    const group: string = level.dataset.difficult;
    
    return group;
}

function randomNumber(start: number, stop: number): number {
    return Math.floor(Math.random() * (stop - start + 1)) + start;
}

function hideContainer(container: HTMLElement): void {
    container.classList.add('hide');
}

function hideVisibilityContainer(container: HTMLElement): void {
    container.classList.add('hide-visibility');
}

function showContainer(container: HTMLElement): void {
    container.classList.add('show');
}

function showStopwatch(group: string, page: string): void {
    const stopwatchСontainer = document.querySelector('.stopwatch-container') as HTMLElement;
    const stopwatch = document.querySelector('.stopwatch') as HTMLElement;
    const headerContainer = document.querySelector('header') as HTMLElement;
    
    showContainer(stopwatchСontainer);
    hideVisibilityContainer(headerContainer);

    const count = document.createElement('span') as HTMLElement;
    stopwatch.append(count);

    let currentDelay: number = CONSTS.DELAY;
    let timerId = setTimeout(function tick() {
        count.innerHTML = String(currentDelay);
        
        stopwatch.style.background = `conic-gradient(#e7161b ${CONSTS.SECTOR[CONSTS.SECTOR.length - currentDelay - 1]}%, transparent 0)`;
        currentDelay = currentDelay - 1;
        
        if (currentDelay < 0) {
            clearInterval(timerId);
            hideContainer(stopwatchСontainer);
            startGameSprint(group, page);
        } else {
            timerId = setTimeout(tick, 1000);
        }
    }, 1000);
}

function fillArrayWordTranslate(words: IWord[]): string[] {
    const wordsTranslate: string[] = [];

    for (let index = 0; index < CONSTS.MAX_LENGTH_ARRAY_TRANSLATE; index += 1) {
        const index: number = randomNumber(0, words.length - 1);
        wordsTranslate.push(words[index].wordTranslate);
    }

    return wordsTranslate;
}

function startGameSprint(group: string, page: string): void {
    const gameContainer = document.querySelector('.game-container') as HTMLElement;
    showContainer(gameContainer);

    const wordsPromise: Promise<IWord[]> = new Controller().getWords(group, page);

    wordsPromise.then((words: IWord[]) => {
        const wordsTranslate: string[] = fillArrayWordTranslate(words);

        localStorage.setItem(CONSTS.WORDS, JSON.stringify(words));
        localStorage.setItem(CONSTS.CURRENT_CARD, String(CONSTS.START_NUMBER_CARD));

        startTimerGame();
        makeWordCard(words, CONSTS.START_NUMBER_CARD, wordsTranslate);
    });
}

function makeWordCard(words: IWord[], index: number, translates: string[]): void {
    const wordText = document.querySelector('.word-text') as HTMLElement;
    const wordTranslate = document.querySelector('.word-translate') as HTMLElement;
    wordText.innerHTML = words[index].word;

    const trueTranslate: string = words[index].wordTranslate;
    const audioWord: string = words[index].audio;
    localStorage.setItem(CONSTS.TRUE_TRANSLATE, trueTranslate);
    localStorage.setItem(CONSTS.AUDIO_WORD, audioWord);

    const translatesCopy: string[] = translates.slice();
    translatesCopy.push(trueTranslate);
    translatesCopy.unshift(trueTranslate);

    const numberTranslate: number = randomNumber(0, translatesCopy.length - 1);
    const currentTranslate: string = translatesCopy[numberTranslate];
    localStorage.setItem(CONSTS.CURRENT_TRANSLATE, currentTranslate);
    wordTranslate.innerHTML = currentTranslate;
}

function makeNextWordCard(): void {
    const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
    const wordsTranslate: string[] = fillArrayWordTranslate(words); 
    const index: number = Number(localStorage[CONSTS.CURRENT_CARD]);

    makeWordCard(words, index, wordsTranslate);
}

function startTimerGame(): void {
    const gameTimer = document.querySelector('.game-timer') as HTMLElement;
    const count = document.createElement('span') as HTMLElement;
    gameTimer.append(count);

    let currentTimer: number = CONSTS.TIMER;
    let timerId = setTimeout(function tick() {
        count.innerHTML = String(currentTimer);
        
        const sector: number = (100 * (60 - currentTimer)) / 60;
        gameTimer.style.background = `conic-gradient(#e7161b ${sector}%, transparent 0)`;
        currentTimer = currentTimer - 1;
        
        if (currentTimer < 0) {
            clearInterval(timerId);
            // stop;
        } else {
            timerId = setTimeout(tick, 1000);
        }
    }, 1000);
}

function makeNextPage(): void {
    const group: string = localStorage[CONSTS.GROUP];
    let page: number = Number(localStorage[CONSTS.PAGE]);

    if (page === 29) {
        page = 0;
    } else {
        page += 1;
    }

    localStorage.setItem(CONSTS.PAGE, String(page));

    const wordsPromise: Promise<IWord[]> = new Controller().getWords(group, String(page));

    wordsPromise.then((words: IWord[]) => {
        const wordsTranslate: string[] = fillArrayWordTranslate(words);

        localStorage.setItem(CONSTS.WORDS, JSON.stringify(words));
        localStorage.setItem(CONSTS.CURRENT_CARD, String(CONSTS.START_NUMBER_CARD));

        makeWordCard(words, CONSTS.START_NUMBER_CARD, wordsTranslate);
    });
}

function checkAnswer(): void {
    const compareTranslate: boolean = localStorage[CONSTS.TRUE_TRANSLATE] === localStorage[CONSTS.CURRENT_TRANSLATE];
    const stateAnswer: boolean = localStorage[CONSTS.ANSWER] === 'true';
    const currentCard: number = Number(localStorage[CONSTS.CURRENT_CARD]);
    const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
    const { minStar, minMedal } = CONSTS.BONUS_STAR_MEDAL;

    if (currentCard === words.length - 1) {
        return;
    }
    
    if (compareTranslate && stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.green);

        const star: number = countBonus().star;
        const medal: number = countBonus().medal;

        localStorage.setItem(CONSTS.BONUS_STAR, String(star));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(medal));

        getBonus(star, medal);
        getPoints(medal);
        getScore();
    }

    if (!compareTranslate && !stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.green);

        const star: number = countBonus().star;
        const medal: number = countBonus().medal;

        localStorage.setItem(CONSTS.BONUS_STAR, String(star));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(medal));

        getBonus(star, medal);
        getPoints(medal);
        getScore();
    }

    if (compareTranslate && !stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.red);

        const star: number = minStar;
        const medal: number = minMedal;

        localStorage.setItem(CONSTS.BONUS_STAR, String(star));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(medal));

        deleteBonus();
        getPoints(medal);
    }

    if (!compareTranslate && stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.red);

        const star: number = minStar;
        const medal: number = minMedal;

        localStorage.setItem(CONSTS.BONUS_STAR, String(star));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(medal));

        deleteBonus();
        getPoints(medal);
    }
}

function countBonus(): Bonus {
    let countBonusStar: number = Number(localStorage[CONSTS.BONUS_STAR]);
    let countBonusMedal: number = Number(localStorage[CONSTS.BONUS_MEDAL]);

    const { minStar, maxStar, maxMedal } = CONSTS.BONUS_STAR_MEDAL;

    if (countBonusStar === maxStar && !(countBonusMedal === maxMedal)) {
        countBonusMedal = (countBonusMedal === maxMedal) ? maxMedal : countBonusMedal + 1;
        countBonusStar = minStar;
        deleteBonusStar();
    } else {
        countBonusStar = (countBonusStar === maxStar) ? maxStar : countBonusStar + 1;
    }

    if (countBonusMedal === maxMedal) {
        countBonusStar = maxStar;
        getBonusStar();
    }

    return {
        star: countBonusStar,
        medal: countBonusMedal
    };
}

function getPoints(medal: number): void {
    const bonusPoints = document.querySelector('.bonus-points') as HTMLElement;
    const points: number = medal ? 20 * medal : 10;

    bonusPoints.innerHTML = `${points}`;

    localStorage.setItem(CONSTS.BONUS_POINTS, String(points));
}

function getScore(): void {
    const scoreGame = document.querySelector('.score') as HTMLElement;
    const points: number = Number(localStorage[CONSTS.BONUS_POINTS]);
    const currentScore: number = Number(localStorage[CONSTS.SCORE]);

    const newScore: number = currentScore + points;
    
    scoreGame.innerHTML = `${newScore}`;
    localStorage.setItem(CONSTS.SCORE, String(newScore));
}

function getBonus(star: number, medal: number): void {
    const bonusStars = document.querySelectorAll('.fa-star') as NodeList;
    const bonusMedal = document.querySelectorAll('.fa-medal') as NodeList;

    for (let index = 0; index < star; index += 1) {
        const star = bonusStars[index] as HTMLElement;
        star.classList.add('mark-star');
    }

    for (let index = 0; index < medal; index += 1) {
        const medal = bonusMedal[index] as HTMLElement;
        medal.classList.add('mark-medal');
    }
}

function getBonusStar(): void {
    const bonusStars = document.querySelectorAll('.fa-star') as NodeList;
    const { maxStar } = CONSTS.BONUS_STAR_MEDAL;

    for (let index = 0; index < maxStar; index += 1) {
        const star = bonusStars[index] as HTMLElement;
        star.classList.add('mark-star');
    }
}

function deleteBonus(): void {
    const bonusStars = document.querySelectorAll('.fa-star') as NodeList;
    const bonusMedal = document.querySelectorAll('.fa-medal') as NodeList;

    bonusStars.forEach((star: HTMLElement) => {
        star.classList.remove('mark-star');
    });

    bonusMedal.forEach((medal: HTMLElement) => {
        medal.classList.remove('mark-medal');
    });
}

function deleteBonusStar(): void {
    const bonusStars = document.querySelectorAll('.fa-star') as NodeList;

    bonusStars.forEach((star: HTMLElement) => {
        star.classList.remove('mark-star');
    });
}

function animateContainer(color: string): void {
    const container = document.querySelector('.word-card') as HTMLElement;

    container.animate([{ boxShadow: '0px 0px 0px 0px #ffffff' }, { boxShadow: `0px 0px 20px 5px ${color}` }], {
        duration: 500,
        iterations: 1,
    });
}

function playAudioWord(): void {
    const audioWordURL: string = `${CONSTS.BASE_URL}${localStorage[CONSTS.AUDIO_WORD]}`;
    const isMute = localStorage[CONSTS.AUDIO_MUTE];
    
    const playAudio = document.createElement('audio') as HTMLAudioElement;
    playAudio.setAttribute('src', audioWordURL);

    if (!isMute) {
        playAudio.play();
    }
}

function closeGame(): void {
    const gameContainer = document.querySelector('.word-card') as HTMLElement;
    gameContainer.classList.add('close-container');

    setTimeout(() => {
        window.location.hash = '#';
    }, 600);
}


// function shuffle(array: string[]) {
//     for (let i = array.length - 1; i > 0; i--) {
//         let j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }

//     return array;
// }

export default {
    //hideContainer,
    getGroup,
    showStopwatch,
    randomNumber, 
    startGameSprint,
    checkAnswer,
    makeNextWordCard,
    makeNextPage,
    closeGame,
    playAudioWord,
};
