import Controller from "../../../spa/tools/controller";
import { IWord, IAuth } from "../../../spa/tools/controllerTypes";
import { IGameState, IGameStatistic, IGamePoints } from  "../../componentTypes";
import CONSTS from "./sprintConsts";
import { aggregatedWords, Bonus, IGameSprintStatistic, WordStorage } from "./sprintTypes";
import { appResultGame } from "../../components/result-game/app.result-game";
import { sendAnswer } from "../audiocall/utils";

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

function showContainer(container: HTMLElement): void {
    container.classList.add('show');
}

function getResultGame(): void {
    const wordCard = document.querySelector('.word-card') as HTMLElement;
    const gameContainer = document.querySelector('.game-container') as HTMLElement;
    const resultContainer = document.querySelector('.result-game-container') as HTMLElement;

    wordCard.classList.add('close-container');

    setTimeout(() => {
        hideContainer(gameContainer);
        resultContainer.classList.remove('hide');
        CONSTS.SOUND_END.play();
        appResultGame.makeResult();
    }, 600);
}

function updatePointsHeader(): void {
    const gamePoints = document.querySelector('.game-points') as HTMLElement;
    if (localStorage[CONSTS.AUDIOCALL_POINTS] && localStorage[CONSTS.SPRINT_POINTS]) {
        const audiocallResult: IGamePoints = JSON.parse(localStorage[CONSTS.AUDIOCALL_POINTS]);
        const sprintResult: IGamePoints = JSON.parse(localStorage[CONSTS.SPRINT_POINTS]);

        const sumPoints: number = Number(audiocallResult.points) + Number(sprintResult.points);
        gamePoints.textContent = String(sumPoints);
    }
}

function saveSprintPoints(): void {
    const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
    const userInfo: IAuth = JSON.parse(localStorage[CONSTS.USER_INFO]);

    if (localStorage[CONSTS.SPRINT_POINTS]) {
        const localResults: IGamePoints = JSON.parse(localStorage[CONSTS.SPRINT_POINTS]);
        
        if (localResults.date === new Date().toLocaleDateString()) {
            const newPoints: number = Number(localResults.points) + resultGameStatistic.score;
            const sprintPoints: IGamePoints = {
                userId: userInfo.userId,
                points: String(newPoints),
                date: new Date().toLocaleDateString(),
            };
            localStorage.setItem(CONSTS.SPRINT_POINTS, JSON.stringify(sprintPoints));
        } else {
            localStorage.removeItem(CONSTS.SPRINT_POINTS);
            const sprintPoints: IGamePoints = {
                userId: userInfo.userId,
                points: String(resultGameStatistic.score),
                date: new Date().toLocaleDateString(),
            };
            localStorage.setItem(CONSTS.SPRINT_POINTS, JSON.stringify(sprintPoints));
        }
    } else {
        const sprintPoints: IGamePoints = {
            userId: userInfo.userId,
            points: String(resultGameStatistic.score),
            date: new Date().toLocaleDateString(),
        };
        localStorage.setItem(CONSTS.SPRINT_POINTS, JSON.stringify(sprintPoints));
    }

    if (userInfo) {
        updatePointsHeader();
    }
}

function saveGameStatistic(): void {
    const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
    let longest: number = resultGameStatistic.rightAnswers + resultGameStatistic.falseAnswers;
    let { rightAnswers } = resultGameStatistic;
    let totalAnswers: number = resultGameStatistic.rightAnswers + resultGameStatistic.falseAnswers;
    const newWords: number = localStorage[CONSTS.SPRINT_NEW_WORDS] ? Number(localStorage[CONSTS.SPRINT_NEW_WORDS]) : 0;
    
    if (localStorage[CONSTS.SPRINT_STATISTIC]) {
        const statistic: IGameStatistic = JSON.parse(localStorage[CONSTS.SPRINT_STATISTIC]);
        
        if (statistic.date === new Date().toLocaleDateString()) {
            longest = (longest > statistic.longest) ? longest : statistic.longest;
            rightAnswers += statistic.rightAnswers;
            totalAnswers += statistic.totalAnswers;
        }
    }

    localStorage.setItem(CONSTS.SPRINT_STATISTIC, JSON.stringify({
        date: new Date().toLocaleDateString(), 
        longest,
        rightAnswers,
        totalAnswers,
        newWords
    }));
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
        currentTimer -= 1;
        
        if (currentTimer < 0) {
            clearInterval(timerId);
            getResultGame();
            saveGameStatistic();
            CONSTS.SOUND_TIME.pause();
            if (localStorage[CONSTS.USER_INFO]) {
                saveSprintPoints();
            }
        } else {
            timerId = setTimeout(tick, 1000);
            localStorage.setItem(CONSTS.TIMER_ID_SPRINT, String(timerId));
        }
    }, 1000);
}

function saveWordLocalStorage(word: string, translate: string, url: string): void {
    const wordStorage: WordStorage = JSON.parse(localStorage[CONSTS.WORD_STORAGE]);
    const newStorage: WordStorage = wordStorage.slice();

    if (wordStorage.length === 0) {
        newStorage.push({
            eng: word,
            rus: translate,
            audioURL: url
        });
    } else if (wordStorage.every(store => word !== store.eng)) {
        newStorage.push({
            eng: word,
            rus: translate,
            audioURL: url
        });
    }

    localStorage.setItem(CONSTS.WORD_STORAGE, JSON.stringify(newStorage));
}

function makeWordCard(words: IWord[], index: number, translates: string[]): void {
    const wordText = document.querySelector('.word-text') as HTMLElement;
    const wordTranslate = document.querySelector('.word-translate') as HTMLElement;
    
    wordText.innerHTML = words[index].word;
    localStorage.setItem(CONSTS.WORD_ENG, words[index].word);
    localStorage.setItem(CONSTS.SPRINT_WORD_ID, words[index].id);

    const { word } = words[index];
    const trueTranslate: string = words[index].wordTranslate;
    const audioWord: string = words[index].audio;
    localStorage.setItem(CONSTS.TRUE_TRANSLATE, trueTranslate);
    localStorage.setItem(CONSTS.AUDIO_WORD, audioWord);

    saveWordLocalStorage(word, trueTranslate, audioWord);

    const translatesCopy: string[] = translates.slice();
    translatesCopy.push(trueTranslate);
    translatesCopy.push(trueTranslate);
    translatesCopy.unshift(trueTranslate);

    const numberTranslate: number = randomNumber(0, translatesCopy.length - 1);
    const currentTranslate: string = translatesCopy[numberTranslate];
    localStorage.setItem(CONSTS.CURRENT_TRANSLATE, currentTranslate);
    wordTranslate.innerHTML = currentTranslate;
}

function fillArrayWordTranslate(words: IWord[]): string[] {
    const wordsTranslate: string[] = [];

    for (let index = 0; index < CONSTS.MAX_LENGTH_ARRAY_TRANSLATE; index += 1) {
        const index: number = randomNumber(0, words.length - 1);
        wordsTranslate.push(words[index].wordTranslate);
    }

    return wordsTranslate;
}

function makeNextPage(): void {
    const group: string = localStorage[CONSTS.GROUP];
    let page = Number(localStorage[CONSTS.PAGE]);

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

function startGameSprint(group?: string, page?: string): void {
    CONSTS.SOUND_TIME.play();

    const resultGameStatistic: IGameSprintStatistic = {
        score: 0,
        rightAnswers: 0,
        falseAnswers: 0,
        rightWords: [],
        falseWords: [],
    };

    localStorage.setItem(CONSTS.GAME_SPRINT_STATISTIC, JSON.stringify(resultGameStatistic));

    if (!localStorage[CONSTS.WORD_STORAGE]) {
        localStorage.setItem(CONSTS.WORD_STORAGE, JSON.stringify([]));
    }
    
    const gameContainer = document.querySelector('.game-container') as HTMLElement;
    showContainer(gameContainer);

    const rightNamePoints = document.querySelector('.right-name-points') as HTMLElement;
    rightNamePoints.innerHTML = '????????';

    if (localStorage[CONSTS.SPRINT_STATE]) {
        const { userId, token } = JSON.parse(localStorage[CONSTS.USER_INFO]);
        const gameState: IGameState = JSON.parse(localStorage[CONSTS.SPRINT_STATE]);
        const allWords: IWord[] = gameState.textbookWords;
        const { level } = gameState;
        const learntWordsPromise: Promise<aggregatedWords[]> = new Controller().getAgregatedWords(userId, token, level, '{"userWord.optional.status":"learnt"}');
        
        learntWordsPromise.then((data) => {
            const learntWords: IWord[] = data[0].paginatedResults;
            const unlearntWords: IWord[] = learntWords.reduce((accum: IWord[], learntWord: IWord) => accum.filter((someWord) => someWord.word !== learntWord.word), allWords);
    
            localStorage.setItem(CONSTS.WORDS, JSON.stringify(unlearntWords));
            localStorage.setItem(CONSTS.CURRENT_CARD, String(CONSTS.START_NUMBER_CARD));
    
            startTimerGame();
            if (unlearntWords.length !== 0) {
                const wordsTranslate: string[] = fillArrayWordTranslate(unlearntWords);
                makeWordCard(unlearntWords, CONSTS.START_NUMBER_CARD, wordsTranslate);
            } else {
                makeNextPage();
            }
        });
    } else {
        const wordsPromise: Promise<IWord[]> = new Controller().getWords(group, page);
        wordsPromise.then((words: IWord[]) => {
            const wordsTranslate: string[] = fillArrayWordTranslate(words);

            localStorage.setItem(CONSTS.WORDS, JSON.stringify(words));
            localStorage.setItem(CONSTS.CURRENT_CARD, String(CONSTS.START_NUMBER_CARD));

            startTimerGame();
            makeWordCard(words, CONSTS.START_NUMBER_CARD, wordsTranslate);
        });
    }
}

function showStopwatch(group?: string, page?: string): void {
    const stopwatch??ontainer = document.querySelector('.stopwatch-container') as HTMLElement;
    const stopwatch = document.querySelector('.stopwatch') as HTMLElement;

    showContainer(stopwatch??ontainer);

    const count = document.createElement('span') as HTMLElement;
    stopwatch.append(count);

    let currentDelay: number = CONSTS.DELAY;
    let timerId = setTimeout(function tick() {
        count.innerHTML = String(currentDelay);
        
        stopwatch.style.background = `conic-gradient(#e7161b ${CONSTS.SECTOR[CONSTS.SECTOR.length - currentDelay - 1]}%, transparent 0)`;
        currentDelay -= 1;
        
        if (currentDelay < 0) {
            clearInterval(timerId);
            hideContainer(stopwatch??ontainer);
            startGameSprint(group, page);
        } else {
            timerId = setTimeout(tick, 1000);
            localStorage.setItem(CONSTS.TIMER_ID_START_GAME, String(timerId));
        }
    }, 1000);
}

function makeNextWordCard(): void {
    const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
    const wordsTranslate: string[] = fillArrayWordTranslate(words); 
    const index = Number(localStorage[CONSTS.CURRENT_CARD]);

    makeWordCard(words, index, wordsTranslate);
}

function rightDeclensionWord(value: number): number {
    let result: number = value % 100;
  
    if (result > 19) {
        result %= 10;
    }
  
    switch (result) {
        case 1: return 0;
        case 2: return 1;
        case 3: return 1;
        case 4: return 1;
        default: return 2;
    }
}

function getPoints(medal: number): void {
    const bonusPoints = document.querySelector('.bonus-points') as HTMLElement;
    const rightNamePoints = document.querySelector('.right-name-points') as HTMLElement;
    const points: number = medal ? 2 * medal : 1;

    bonusPoints.innerHTML = `${points}`;
    rightNamePoints.innerHTML = CONSTS.NAME_COUNT_POINTS[rightDeclensionWord(points)];

    localStorage.setItem(CONSTS.BONUS_POINTS, String(points));
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

function animateContainer(color: string): void {
    const container = document.querySelector('.word-card') as HTMLElement;

    container.animate([{ boxShadow: '0px 0px 0px 0px #ffffff' }, { boxShadow: `0px 0px 20px 5px ${color}` }], {
        duration: 500,
        iterations: 1,
    });
}

function getScore(): void {
    const scoreGame = document.querySelector('.score') as HTMLElement;
    const points = Number(localStorage[CONSTS.BONUS_POINTS]);
    const currentScore = Number(localStorage[CONSTS.SCORE]);
    const newScore: number = currentScore + points;
    
    scoreGame.innerHTML = `${newScore}`;
    localStorage.setItem(CONSTS.SCORE, String(newScore));

    const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
    resultGameStatistic.score = newScore;
    localStorage.setItem(CONSTS.GAME_SPRINT_STATISTIC, JSON.stringify(resultGameStatistic));
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

function deleteBonusStar(): void {
    const bonusStars = document.querySelectorAll('.fa-star') as NodeList;

    bonusStars.forEach((star: HTMLElement) => {
        star.classList.remove('mark-star');
    });
}

function countBonus(): Bonus {
    let countBonusStar = Number(localStorage[CONSTS.BONUS_STAR]);
    let countBonusMedal = Number(localStorage[CONSTS.BONUS_MEDAL]);

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

async function sendAnswerToServer(wordId: string, correctness: string, level: string) {
    if (localStorage.getItem('userInfo')) {
        const isNew: boolean = await sendAnswer(wordId, correctness, level, 'sprint');
        if (isNew) {
            if (localStorage[CONSTS.SPRINT_NEW_WORDS]) {
                const newWords = Number(localStorage[CONSTS.SPRINT_NEW_WORDS]);
                localStorage.setItem(CONSTS.SPRINT_NEW_WORDS, String(newWords + 1));
            } else {
                localStorage.setItem(CONSTS.SPRINT_NEW_WORDS, String(1));
            }
        }
    }
}

function checkAnswer(): void {
    const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
    const wordEng: string = localStorage[CONSTS.WORD_ENG];
    const wordRus: string = localStorage[CONSTS.TRUE_TRANSLATE];
    const compareTranslate: boolean = localStorage[CONSTS.TRUE_TRANSLATE] === localStorage[CONSTS.CURRENT_TRANSLATE];
    const stateAnswer: boolean = localStorage[CONSTS.ANSWER] === 'true';
    const currentCard = Number(localStorage[CONSTS.CURRENT_CARD]);
    const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
    const { minStar, minMedal } = CONSTS.BONUS_STAR_MEDAL;
    const wordId: string = localStorage[CONSTS.SPRINT_WORD_ID];
    const level: string = localStorage[CONSTS.GROUP];

    if (currentCard === words.length - 1) {
        return;
    }
    
    if ((compareTranslate && stateAnswer) || (!compareTranslate && !stateAnswer)) {
        CONSTS.SOUND_RIGHT_ANSWER.play();
        animateContainer(CONSTS.COLOR_SHADOW.green);
        
        const rightAnswers = Number(resultGameStatistic.rightAnswers);
        resultGameStatistic.rightAnswers = rightAnswers + 1;
        resultGameStatistic.rightWords.push({
            eng: wordEng,
            rus: wordRus,
            audioURL: localStorage[CONSTS.AUDIO_WORD],
        });

        localStorage.setItem(CONSTS.GAME_SPRINT_STATISTIC, JSON.stringify(resultGameStatistic));

        const { star, medal } = countBonus();
        localStorage.setItem(CONSTS.BONUS_STAR, String(star));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(medal));

        sendAnswerToServer(wordId, 'correct', level);
        getBonus(star, medal);
        getPoints(medal);
        getScore();
    }

    if ((compareTranslate && !stateAnswer) || (!compareTranslate && stateAnswer)) {
        CONSTS.SOUND_FALSE_ANSWER.play();
        animateContainer(CONSTS.COLOR_SHADOW.red);

        const falseAnswers = Number(resultGameStatistic.falseAnswers);
        resultGameStatistic.falseAnswers = falseAnswers + 1;
        resultGameStatistic.falseWords.push({
            eng: wordEng,
            rus: wordRus,
            audioURL: localStorage[CONSTS.AUDIO_WORD],
        });
        localStorage.setItem(CONSTS.GAME_SPRINT_STATISTIC, JSON.stringify(resultGameStatistic));

        const star: number = minStar;
        const medal: number = minMedal;

        localStorage.setItem(CONSTS.BONUS_STAR, String(star));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(medal));

        sendAnswerToServer(wordId, 'incorrect', level);
        deleteBonus();
        getPoints(medal);
    }
}

function playAudioWord(): void {
    const audioWordURL = `${CONSTS.BASE_URL}${localStorage[CONSTS.AUDIO_WORD]}`;
    const isMute = localStorage[CONSTS.AUDIO_MUTE];
    const playAudio: HTMLAudioElement = new Audio(audioWordURL);

    if (!isMute) {
        playAudio.play();
    }
}

function closeGame(): void {
    const wordCard = document.querySelector('.word-card') as HTMLElement;
    wordCard.classList.add('close-container');

    setTimeout(() => {
        window.location.hash = '#';
    }, 600);
}

export default {
    getGroup,
    showStopwatch,
    randomNumber, 
    startGameSprint,
    checkAnswer,
    makeNextWordCard,
    makeNextPage,
    closeGame,
    playAudioWord,
    rightDeclensionWord,
    hideContainer,
};
