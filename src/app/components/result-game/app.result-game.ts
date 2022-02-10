import './app.result-game.scss';
import ResultGame from './app.result-game.html';
import { Component } from '../../../spa';
import { IGameSprintStatistic, WordAnswer } from '../../pages/sprint/sprintTypes';
import CONSTS from '../../pages/sprint/sprintConsts';

class AppResultGame extends Component {
    makeResultGame():void {
        const scoreGame = document.querySelector('.score-game') as HTMLElement;
        const trueAnswerContainer = document.querySelector('.true-answer-container') as HTMLElement;
        const falseAnswerContainer = document.querySelector('.false-answer-container') as HTMLElement;
        const trueAnswer = document.querySelector('.true-answer') as HTMLElement;
        const falseAnswer = document.querySelector('.false-answer') as HTMLElement;
        const resultGameStatistic: IGameSprintStatistic = JSON.parse(localStorage[CONSTS.GAME_SPRINT_STATISTIC]);
        
        scoreGame.innerHTML = String(resultGameStatistic.score);
        trueAnswer.innerHTML = String(resultGameStatistic.rightAnswers);
        falseAnswer.innerHTML = String(resultGameStatistic.falseAnswers);

        const rightWords: WordAnswer[] = resultGameStatistic.rightWords;
        const falseWords: WordAnswer[] = resultGameStatistic.falseWords;

        this.fillContainer(trueAnswerContainer, rightWords);
        this.fillContainer(falseAnswerContainer, falseWords);
    }

    fillContainer(container: HTMLElement, words: WordAnswer[]): void {
        const list = document.createElement('ul') as HTMLElement;
        list.classList.add('word-list');

        words.forEach((word: WordAnswer) => {
            const liItem = document.createElement('li') as HTMLElement;
            const itemAudio = document.createElement('span') as HTMLElement;
            const itemWordEng = document.createElement('span') as HTMLElement;
            const itemWordRus = document.createElement('span') as HTMLElement;

            liItem.classList.add('word-list-item');
            itemAudio.classList.add('item-audio');
            
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

    getEventsClick(event: Event): void {
        if (event.target instanceof Element) {
            const itemAudio = event.target.closest('.item-audio') as HTMLElement;

            if (itemAudio) {
                const audioURL: string = `${CONSTS.BASE_URL}${itemAudio.dataset.sound}`;
                const playAudio = document.createElement('audio') as HTMLAudioElement;
                playAudio.setAttribute('src', audioURL);
                playAudio.play();
            }
        }
    }
}

export const appResultGame = new AppResultGame({
  selector: 'app-result-game',
  template: ResultGame,
});

document.addEventListener('click', appResultGame.getEventsClick);
