import './app.result-game.scss';
import ResultGame from './app.result-game.html';
import { Component } from '../../../spa';
import CONSTS from '../../pages/sprint/sprintConsts';
import { checkScore, makeDiagram, makeWordsList } from './app.result-game-utils';

class AppResultGame extends Component {
  getEventsClick(event: Event): void {
    if (event.target instanceof Element) {
      const itemAudio = event.target.closest('.item-audio') as HTMLElement;
      const btnResult = event.target.closest('.btn-result') as HTMLElement;
      const btnWords = event.target.closest('.btn-words') as HTMLElement;
      const gameAgain = event.target.closest('.game-again') as HTMLElement;
      const gameClose = event.target.closest('.game-close') as HTMLElement;
      
      if (itemAudio) {
        const audioURL = `${CONSTS.BASE_URL}${itemAudio.dataset.sound}`;
        const playAudio = document.createElement('audio') as HTMLAudioElement;
        playAudio.setAttribute('src', audioURL);
        playAudio.play();
      }

      if (btnResult) {
        const btnWords = document.querySelector('.btn-words') as HTMLElement;
        btnResult.classList.add('btn-active');
        btnWords.classList.remove('btn-active');
        makeDiagram();
      }

      if (btnWords) {
        const btnResult = document.querySelector('.btn-result') as HTMLElement;
        btnResult.classList.remove('btn-active');
        btnWords.classList.add('btn-active');
        makeWordsList();
      }

      if (gameAgain || gameClose) {
        checkScore();
      }
    }
  }

  makeResult(): void {
    makeDiagram();
  }

  afterInit() {
    const container = document.querySelector('.result-game-container');
    container.addEventListener('click', this.getEventsClick.bind(this));
  }
}

export const appResultGame = new AppResultGame({
  selector: 'app-result-game',
  template: ResultGame,
});
