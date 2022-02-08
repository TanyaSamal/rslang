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
      const buttonTrue = event.target.closest('.button-true') as HTMLElement;
      const buttonFalse = event.target.closest('.button-false') as HTMLElement;

      if (volume) {
        volume.classList.toggle('volume-mute');
      }

      if (buttonStartSprint) {
        const welcomeContainer = document.querySelector('.welcome-container') as HTMLElement;
        const group: string = UTILS.getGroup();
        const page: string = String(UTILS.randomNumber(CONSTS.MIN_PAGE, CONSTS.MAX_PAGE));

        localStorage.setItem(CONSTS.GROUP, group);
        localStorage.setItem(CONSTS.PAGE, page);

        localStorage.setItem(CONSTS.BONUS_STAR, String(CONSTS.BONUS_STAR_MEDAL.minStar));
        localStorage.setItem(CONSTS.BONUS_MEDAL, String(CONSTS.BONUS_STAR_MEDAL.minMedal));

        localStorage.setItem(CONSTS.SCORE, '0');

        UTILS.hideContainer(welcomeContainer);
        UTILS.showStopwatch(group, page);
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
        const buttonFalse = document.querySelector('.button-false');
        buttonFalse.setAttribute('disabled', 'true');
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
        const buttonTrue = document.querySelector('.button-true');
        buttonTrue.setAttribute('disabled', 'true');
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

appSelectDifficulty.nameGame = CONSTS.GAME_SPRINT_OPTION.name;
appSelectDifficulty.descriptionGame = CONSTS.GAME_SPRINT_OPTION.description;

document.addEventListener('click', sprintComponent.getEventsClick);
document.addEventListener('keydown', sprintComponent.getEventsKeyDown);
