import Controller from "../../../spa/tools/controller";
import { IWord } from "../../../spa/tools/controllerTypes";
import CONSTS from "./consts";

function changeStyleElement(element: HTMLElement): void {
    const borderColor: string = window.getComputedStyle(element).borderColor;

    element.classList.add('click-level');
    element.style.borderRadius = '50%';
    element.style.backgroundColor = borderColor;
}

function resetStyleElement(): void {
    const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

    allLevel.forEach((element: HTMLElement) => {
        element.classList.remove('click-level');
        element.style.borderRadius = '0px';
        element.style.backgroundColor = '#000000';
    });
}

function mouseOverElement(element: HTMLElement): void {
    const borderColor: string = window.getComputedStyle(element).borderColor;

    element.style.backgroundColor = borderColor;
}

function mouseOutElement(element: HTMLElement): void {
    const allLevel: NodeListOf<Element> = document.querySelectorAll('.level');

    allLevel.forEach((element: HTMLElement) => {
        if (!element.classList.contains('click-level')) {
            element.style.backgroundColor = '#000000';
        }
    });
}

function activateButton(): void {
    const button = document.querySelector('.start-sprint') as HTMLElement;
    
    button.removeAttribute('disabled');
    button.classList.add('start-sprint-enable');
}

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

function showStopwatch(group: string, page: string): void {
    const stopwatchСontainer = document.querySelector('.stopwatch-container') as HTMLElement;
    const stopwatch = document.querySelector('.stopwatch') as HTMLElement;
    showContainer(stopwatchСontainer);

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
    localStorage.setItem(CONSTS.TRUE_TRANSLATE, trueTranslate);

    const translatesCopy: string[] = translates.slice();
    translatesCopy.push(trueTranslate);

    console.log(translatesCopy);   

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

function checkAnswer(): void {
    const compareTranslate: boolean = localStorage[CONSTS.TRUE_TRANSLATE] === localStorage[CONSTS.CURRENT_TRANSLATE];
    const stateAnswer: boolean = localStorage[CONSTS.ANSWER] === 'true';

    console.log(compareTranslate, stateAnswer);
    
    if (compareTranslate && stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.green);
    }

    if (!compareTranslate && !stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.green);
    }

    if (compareTranslate && !stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.red);
    }

    if (!compareTranslate && stateAnswer) {
        animateContainer(CONSTS.COLOR_SHADOW.red);
    }
}

function animateContainer(color: string): void {
    const container = document.querySelector('.word-card') as HTMLElement;

    container.animate([{ boxShadow: '0px 0px 0px 0px #ffffff' }, { boxShadow: `0px 0px 20px 5px ${color}` }], {
        duration: 500,
        iterations: 2,
    });
}


// function shuffle(array: string[]) {
//     for (let i = array.length - 1; i > 0; i--) {
//         let j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }

//     return array;
// }

export default {
    activateButton, 
    changeStyleElement, 
    getGroup, 
    hideContainer,
    showStopwatch,
    mouseOutElement, 
    mouseOverElement, 
    randomNumber, 
    resetStyleElement, 
    startGameSprint,
    checkAnswer,
    makeNextWordCard,
};
