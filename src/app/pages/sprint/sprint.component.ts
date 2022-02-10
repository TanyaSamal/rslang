import { Component } from '../../../spa';
import Sprint from './sprint.component.html';
import './sprint.component.scss';
import { appHeader } from '../../components/header/app.header';
import UTILS from './sprintUtils';
import CONSTS from './sprintConsts';
import { IWord } from '../../../spa/tools/controllerTypes';
import { appSelectDifficulty } from '../../components/select-dificult/app.select-difficulty';

class SprintComponent extends Component {
  getEventsClick(event: Event): void {
    if (event.target instanceof Element) {
      const buttonStartSprint = event.target.closest('.start-sprint') as HTMLElement;
      const volume = event.target.closest('.volume') as HTMLElement;
      const close = event.target.closest('.fa-window-close') as HTMLElement;
      const buttonTrue = event.target.closest('.button-true') as HTMLElement;
      const buttonFalse = event.target.closest('.button-false') as HTMLElement;

      if (buttonStartSprint) {
        const group: string = UTILS.getGroup();
        const page: string = String(UTILS.randomNumber(CONSTS.MIN_PAGE, CONSTS.MAX_PAGE));

        UTILS.showStopwatch(group, page);
      }

      if (volume) {
        volume.classList.toggle('volume-mute');
      }

      if (close) {
        UTILS.closeGame();
        // const gameContainer = document.querySelector('.word-card') as HTMLElement;
        // gameContainer.classList.add('close-container');
        // window.location.hash = '#';
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
          //buttonTrue.setAttribute('disabled', 'true');
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
          //buttonFalse.setAttribute('disabled', 'true');
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
        // const buttonFalse = document.querySelector('.button-false') as HTMLElement;
        // buttonFalse.setAttribute('disabled', 'true');
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
        // const buttonTrue = document.querySelector('.button-true') as HTMLElement;
        // buttonTrue.setAttribute('disabled', 'true');
      }
    }
  }
}

export const sprintComponent = new SprintComponent({
  selector: 'app-sprint',
  components: [
    appHeader,
    appSelectDifficulty,
  ],
  template: Sprint,
});

document.addEventListener('click', sprintComponent.getEventsClick);
document.addEventListener('keydown', sprintComponent.getEventsKeyDown);
