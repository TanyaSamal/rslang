import { IGameSprintStatistic, WordAnswer } from '../../pages/sprint/sprintTypes';
import CONSTS from '../../pages/sprint/sprintConsts';
import UTILS from '../../pages/sprint/sprintUtils';

export function makeDiagram(): void {
  const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
  const resultWordsContainer = document.querySelector('.result-words') as HTMLElement;
  const resultDiagramContainer = document.querySelector('.result-diagram-main') as HTMLElement;

  resultWordsContainer.classList.add('hide');
  resultDiagramContainer.classList.remove('hide');

  const diagramResult = document.querySelector('.diagram-result') as HTMLElement;
  const newDiagramResult = document.querySelector('.diagram-result-new') as HTMLElement;
  const currentScoreSpan = document.querySelector('.inside-new') as HTMLElement;
  const countWords = document.querySelector('.count-words') as HTMLElement;
  const insideCircle1= document.querySelector('.circle-1') as HTMLElement;
  const insideCircle2 = document.querySelector('.circle-2') as HTMLElement;
  const percentResult = document.querySelector('.percent-result') as HTMLElement;

  let bestScore: number = null;
  const currentScore: number = resultGameStatistic.score;
  const currentNumberWords: number = resultGameStatistic.rightAnswers + resultGameStatistic.falseAnswers;
  let sector = 0;
  let timerId: number = null;

  const wordDeclensionTrue: string = CONSTS.NAME_COUNT_WORDS[UTILS.rightDeclensionWord(currentNumberWords)];
  const pointDeclensionTrue: string = CONSTS.NAME_COUNT_POINTS[UTILS.rightDeclensionWord(currentScore)];

  if (!localStorage[CONSTS.BEST_SCORE]) {
    bestScore = currentScore;
    const newShift_1 = (currentScore * 100) / bestScore;
    const newShift_2 = (currentScore * 360) / bestScore;

    animateDiagramResult(diagramResult, bestScore, CONSTS.COLOR_DIAGRAMM.old);
    animateNewDiagramResult(newDiagramResult, currentScore, CONSTS.COLOR_DIAGRAMM.new, newShift_1, newShift_2);
  } else {
    bestScore = Number(localStorage[CONSTS.BEST_SCORE]);
    const newShift_1 = (currentScore <= bestScore) ? (currentScore * 100) / bestScore : 100;
    const newShift_2 = (currentScore <= bestScore) ? (currentScore * 360) / bestScore : 100;

    animateDiagramResult(diagramResult, bestScore, CONSTS.COLOR_DIAGRAMM.old);
    animateNewDiagramResult(newDiagramResult, currentScore, CONSTS.COLOR_DIAGRAMM.new, newShift_1, newShift_2);
  }

  function animateDiagramResult(diagrame: HTMLElement, points: number, color: string): void {
    countWords.innerHTML = `Изучено: ${currentNumberWords} ${wordDeclensionTrue}`;
    diagrame.style.backgroundColor = `${color}`;
    diagrame.style.background = `conic-gradient(${color} 100%, transparent 0)`;
  }

  function animateNewDiagramResult(diagrame: HTMLElement, points: number, color: string, diff_1: number, diff_2: number): void {
    window.requestAnimationFrame(tick);

    function tick(): void {
      const percent: number = Math.round((sector * 100) / bestScore);
      percentResult.innerHTML = `${percent}%`;
      currentScoreSpan.innerHTML = `Счёт: ${Math.round(sector)} ${pointDeclensionTrue}`;
      const shift_1 = (sector * diff_1) / points;
      const shift_2 = (sector * diff_2) / points;

      diagrame.style.backgroundColor = `${color}`;
      diagrame.style.background = `conic-gradient(${color} ${shift_1}%, transparent 0)`;
      
      insideCircle1.style.backgroundColor = `${color}`;
      insideCircle2.style.backgroundColor = `${color}`;
      insideCircle2.style.transform = `rotate(${shift_2}deg)`;
      
      sector = sector + 0.5;
      
      if (sector > points) {
        cancelAnimationFrame(timerId);
        makeCitation();
      } else {
        timerId = window.requestAnimationFrame(tick);
      }
    }
  }

  function makeCitation(): void {
    const citation = document.querySelector('.citation') as HTMLElement;

    if (bestScore === currentScore && !localStorage[CONSTS.BEST_SCORE]) {
      citation.innerHTML = CONSTS.CITATION.first;
    }

    if (bestScore === currentScore && localStorage[CONSTS.BEST_SCORE]) {
      citation.innerHTML = CONSTS.CITATION.one;
    }

    if (bestScore > currentScore) {
      citation.innerHTML = CONSTS.CITATION.two;
    }

    if (bestScore < currentScore) {
      citation.innerHTML = CONSTS.CITATION.three;
    }
  }
}

export function makeWordsList(): void {
  const resultWordsContainer = document.querySelector('.result-words') as HTMLElement;
  const resultDiagramContainer = document.querySelector('.result-diagram-main') as HTMLElement;

  resultDiagramContainer.classList.add('hide');
  resultWordsContainer.classList.remove('hide');

  const wordsList = document.querySelectorAll('.word-list') as NodeListOf<Element>;

  wordsList.forEach((wordList: HTMLElement) => {
    wordList.remove();
  });
  
  makeResultGame();
}

export function checkScore(): void {
  const currentScore: number = Number(localStorage[CONSTS.SCORE]);
  const bestScore: number = Number(localStorage[CONSTS.BEST_SCORE]);

  if (!localStorage[CONSTS.BEST_SCORE]) {
    localStorage.setItem(CONSTS.BEST_SCORE, String(currentScore));
  }

  if (currentScore > bestScore) {
    localStorage.setItem(CONSTS.BEST_SCORE, String(currentScore));
  }
}

function makeResultGame():void {
  const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
  const trueAnswerContainer = document.querySelector('.true-answer-container') as HTMLElement;
  const falseAnswerContainer = document.querySelector('.false-answer-container') as HTMLElement;
  const trueAnswer = document.querySelector('.true-answer') as HTMLElement;
  const falseAnswer = document.querySelector('.false-answer') as HTMLElement;
  const wordDeclensionTrue: string = CONSTS.NAME_COUNT_WORDS[UTILS.rightDeclensionWord(resultGameStatistic.rightAnswers)];
  const wordDeclensionFalse: string = CONSTS.NAME_COUNT_WORDS[UTILS.rightDeclensionWord(resultGameStatistic.falseAnswers)];
  
  trueAnswer.innerHTML = `${String(resultGameStatistic.rightAnswers)} ${wordDeclensionTrue}`;
  falseAnswer.innerHTML = `${String(resultGameStatistic.falseAnswers)} ${wordDeclensionFalse}`;

  const rightWords: WordAnswer[] = resultGameStatistic.rightWords;
  const falseWords: WordAnswer[] = resultGameStatistic.falseWords;

  fillContainer(trueAnswerContainer, rightWords);
  fillContainer(falseAnswerContainer, falseWords);
}

function fillContainer(container: HTMLElement, words: WordAnswer[]): void {
  const list = document.createElement('ul') as HTMLElement;
  list.classList.add('word-list');

  words.forEach((word: WordAnswer) => {
    const liItem = document.createElement('li') as HTMLElement;
    const itemAudio = document.createElement('span') as HTMLElement;
    const itemWordEng = document.createElement('span') as HTMLElement;
    const itemWordRus = document.createElement('span') as HTMLElement;

    liItem.classList.add('word-list-item');
    itemAudio.classList.add('item-audio');
    itemWordRus.classList.add('word-rus');
    
    itemAudio.setAttribute('data-sound', word.audioURL);
    itemAudio.innerHTML = '<i class="fas fa-file-audio"></i>';
    itemWordEng.innerHTML = `${word.eng} - `;
    itemWordRus.innerHTML = word.rus;

    liItem.append(itemAudio);
    liItem.append(itemWordEng);
    liItem.append(itemWordRus);
    list.append(liItem);
  });

  container.append(list);
}
