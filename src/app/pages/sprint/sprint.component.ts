import { Component } from '../../../spa';
import Sprint from './sprint.component.html';
import './sprint.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appSelectDifficulty } from '../../components/select-difficulty/app.select-difficulty';
import UTILS from './sprintUtils';
import CONSTS from './sprintConsts';
import { IWord } from '../../../spa/tools/controllerTypes';

class SprintComponent extends Component {
  getEventsClick(event: Event): void {
    if (event.target instanceof Element) {
      // const level1 = event.target.closest('.level1') as HTMLElement;
      // const level2 = event.target.closest('.level2') as HTMLElement;
      // const level3 = event.target.closest('.level3') as HTMLElement;
      // const level4 = event.target.closest('.level4') as HTMLElement;
      // const level5 = event.target.closest('.level5') as HTMLElement;
      // const level6 = event.target.closest('.level6') as HTMLElement;
      const buttonStartSprint = event.target.closest('.start-sprint') as HTMLElement;
      const volume = event.target.closest('.volume') as HTMLElement;
      const buttonTrue = event.target.closest('.button-true') as HTMLElement;
      const buttonFalse = event.target.closest('.button-false') as HTMLElement;
    
      // if (level1) {
      //   UTILS.resetStyleElement();
      //   UTILS.changeStyleElement(level1);
      //   UTILS.activateButton();
      // }

      // if (level2) {
      //   UTILS.resetStyleElement();
      //   UTILS.changeStyleElement(level2);
      //   UTILS.activateButton();
      // }

      // if (level3) {
      //   UTILS.resetStyleElement();
      //   UTILS.changeStyleElement(level3);
      //   UTILS.activateButton();
      // }

      // if (level4) {
      //   UTILS.resetStyleElement();
      //   UTILS.changeStyleElement(level4);
      //   UTILS.activateButton();
      // }

      // if (level5) {
      //   UTILS.resetStyleElement();
      //   UTILS.changeStyleElement(level5);
      //   UTILS.activateButton();
      // }

      // if (level6) {
      //   UTILS.resetStyleElement();
      //   UTILS.changeStyleElement(level6);
      //   UTILS.activateButton();
      // }

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

  // getEventsMouseOver(event: Event): void {
  //   if (event.target instanceof Element) {
  //     const level1 = event.target.closest('.level1') as HTMLElement;
  //     const level2 = event.target.closest('.level2') as HTMLElement;
  //     const level3 = event.target.closest('.level3') as HTMLElement;
  //     const level4 = event.target.closest('.level4') as HTMLElement;
  //     const level5 = event.target.closest('.level5') as HTMLElement;
  //     const level6 = event.target.closest('.level6') as HTMLElement;
    
  //     if (level1) {
  //       UTILS.mouseOverElement(level1);
  //     }

  //     if (level2) {
  //       UTILS.mouseOverElement(level2);
  //     }

  //     if (level3) {
  //       UTILS.mouseOverElement(level3);
  //     }

  //     if (level4) {
  //       UTILS.mouseOverElement(level4);
  //     }

  //     if (level5) {
  //       UTILS.mouseOverElement(level5);
  //     }

  //     if (level6) {
  //       UTILS.mouseOverElement(level6);
  //     }
  //   }
  // }

  // getEventsMouseOut(event: Event): void {
  //   if (event.target instanceof Element) {
  //     const level1 = event.target.closest('.level1') as HTMLElement;
  //     const level2 = event.target.closest('.level2') as HTMLElement;
  //     const level3 = event.target.closest('.level3') as HTMLElement;
  //     const level4 = event.target.closest('.level4') as HTMLElement;
  //     const level5 = event.target.closest('.level5') as HTMLElement;
  //     const level6 = event.target.closest('.level6') as HTMLElement;
    
  //     if (level1) {
  //       UTILS.mouseOutElement(level1);
  //     }

  //     if (level2) {
  //       UTILS.mouseOutElement(level2);
  //     }

  //     if (level3) {
  //       UTILS.mouseOutElement(level3);
  //     }

  //     if (level4) {
  //       UTILS.mouseOutElement(level4);
  //     }

  //     if (level5) {
  //       UTILS.mouseOutElement(level5);
  //     }

  //     if (level6) {
  //       UTILS.mouseOutElement(level6);
  //     }
  //   }
  // }

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

document.addEventListener('click', sprintComponent.getEventsClick);
// document.addEventListener('mouseover', sprintComponent.getEventsMouseOver);
// document.addEventListener('mouseout', sprintComponent.getEventsMouseOut);
document.addEventListener('keydown', sprintComponent.getEventsKeyDown);
