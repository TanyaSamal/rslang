import { Component } from '../../../spa';
import Sprint from './sprint.component.html';
import './sprint.component.scss';
import { appHeader } from '../../components/header/app.header';
import UTILS from './sprintUtils';
import CONSTS from './sprintConsts';
import { IWord } from '../../../spa/tools/controllerTypes';
import { appSelectDifficulty } from '../../components/select-dificult/app.select-difficulty';
import { appResultGame } from '../../components/result-game/app.result-game';

class SprintComponent extends Component {
  getEventsClick(event: Event): void {
    if (event.target instanceof Element) {
      const buttonStartSprint = event.target.closest('.start-sprint') as HTMLElement;
      const volume = event.target.closest('.volume') as HTMLElement;
      const close = event.target.closest('.fa-window-close') as HTMLElement;
      const buttonTrue = event.target.closest('.button-true') as HTMLElement;
      const buttonFalse = event.target.closest('.button-false') as HTMLElement;
      const audioWord = event.target.closest('.word-sound') as HTMLElement;

      if (buttonStartSprint) {
        const group: string = UTILS.getGroup();
        const page: string = String(UTILS.randomNumber(CONSTS.MIN_PAGE, CONSTS.MAX_PAGE));

        UTILS.showStopwatch(group, page);
      }

      if (volume) {
        volume.classList.toggle('volume-mute');
        
        if (volume.classList.contains('volume-mute')) {
          localStorage.setItem(CONSTS.AUDIO_MUTE, 'true');
        } else {
          localStorage.removeItem(CONSTS.AUDIO_MUTE);
        }
      }

      if (close) {
        UTILS.closeGame();
      }

      if (audioWord) {
        UTILS.playAudioWord();
      }

      if (buttonTrue) {
        localStorage.setItem(CONSTS.ANSWER, CONSTS.TRUE);
        UTILS.checkAnswer();

        const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
        const currentCard: number = Number(localStorage[CONSTS.CURRENT_CARD]);
        const newCard: number = currentCard + 1;
        
        if (newCard < words.length) {
          localStorage.setItem(CONSTS.CURRENT_CARD, String(newCard));
          UTILS.makeNextWordCard();
        } else {
          UTILS.makeNextPage();
        }
      }

      if (buttonFalse) {
        localStorage.setItem(CONSTS.ANSWER, CONSTS.FALSE);
        UTILS.checkAnswer();

        const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
        const currentCard: number = Number(localStorage[CONSTS.CURRENT_CARD]);
        const newCard: number = currentCard + 1;
        
        if (newCard < words.length) {
          localStorage.setItem(CONSTS.CURRENT_CARD, String(newCard));
          UTILS.makeNextWordCard();
        } else {
          UTILS.makeNextPage();
        }
      }
    }
  }

  getEventsKeyDown(event: KeyboardEvent): void {
    if (event.key === CONSTS.KEYS.arrowLeft) {
      localStorage.setItem(CONSTS.ANSWER, CONSTS.FALSE);
      UTILS.checkAnswer();

      const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
      const currentCard: number = Number(localStorage[CONSTS.CURRENT_CARD]);
      const newCard: number = currentCard + 1;
      
      if (newCard < words.length) {
        localStorage.setItem(CONSTS.CURRENT_CARD, String(newCard));
        UTILS.makeNextWordCard();
      } else {
        UTILS.makeNextPage();
      }
    }

    if (event.key === CONSTS.KEYS.ArrowRight) {
      localStorage.setItem(CONSTS.ANSWER, CONSTS.TRUE);
      UTILS.checkAnswer();

      const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
      const currentCard: number = Number(localStorage[CONSTS.CURRENT_CARD]);
      const newCard: number = currentCard + 1;
      
      if (newCard < words.length) {
        localStorage.setItem(CONSTS.CURRENT_CARD, String(newCard));
        UTILS.makeNextWordCard();
      } else {
        UTILS.makeNextPage();
      }
    }
  }
}

export const sprintComponent = new SprintComponent({
  selector: 'app-sprint',
  components: [
    appHeader,
    appSelectDifficulty,
    appResultGame,
  ],
  template: Sprint,
});

document.addEventListener('click', sprintComponent.getEventsClick);
document.addEventListener('keydown', sprintComponent.getEventsKeyDown);
