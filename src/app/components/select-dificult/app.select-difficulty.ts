import './app.select-difficulty.scss';
import SelectDifficulty from './app.select-difficulty.html';
import { Component } from '../../../spa';
import UTILS from './app.select-difficulty-utils';
import CONSTS from './app.select-difficulty.consts';

class AppSelectDifficulty extends Component {
  getEventsClick(event: Event): void {
    if (event.target instanceof Element) {
      const level1 = event.target.closest('.level1') as HTMLElement;
      const level2 = event.target.closest('.level2') as HTMLElement;
      const level3 = event.target.closest('.level3') as HTMLElement;
      const level4 = event.target.closest('.level4') as HTMLElement;
      const level5 = event.target.closest('.level5') as HTMLElement;
      const level6 = event.target.closest('.level6') as HTMLElement;
      const buttonStartSprint = event.target.closest('.start-sprint') as HTMLElement;
    
      if (level1) {
        UTILS.resetStyleElement();
        UTILS.changeStyleElement(level1);
        UTILS.activateButton();
      }

      if (level2) {
        UTILS.resetStyleElement();
        UTILS.changeStyleElement(level2);
        UTILS.activateButton();
      }

      if (level3) {
        UTILS.resetStyleElement();
        UTILS.changeStyleElement(level3);
        UTILS.activateButton();
      }

      if (level4) {
        UTILS.resetStyleElement();
        UTILS.changeStyleElement(level4);
        UTILS.activateButton();
      }

      if (level5) {
        UTILS.resetStyleElement();
        UTILS.changeStyleElement(level5);
        UTILS.activateButton();
      }

      if (level6) {
        UTILS.resetStyleElement();
        UTILS.changeStyleElement(level6);
        UTILS.activateButton();
      }

      if (level1 || level2 || level3 || level4 || level5 || level6) {
        const group: string = UTILS.getGroup();
        const page = String(UTILS.randomNumber(CONSTS.MIN_PAGE, CONSTS.MAX_PAGE));

        localStorage.setItem(CONSTS.GROUP, group);
        localStorage.setItem(CONSTS.PAGE, page);
      }

      if (buttonStartSprint) {
        const welcomeContainer = document.querySelector('.welcome-container') as HTMLElement;

        if (localStorage[CONSTS.SPRINT_STATE]) {
          localStorage.setItem(CONSTS.SCORE, '0');
          localStorage.removeItem(CONSTS.AUDIO_MUTE);
          UTILS.hideContainer(welcomeContainer);
        } else {
          localStorage.setItem(CONSTS.BONUS_STAR, String(CONSTS.BONUS_STAR_MEDAL.minStar));
          localStorage.setItem(CONSTS.BONUS_MEDAL, String(CONSTS.BONUS_STAR_MEDAL.minMedal));
          localStorage.setItem(CONSTS.SCORE, '0');
          localStorage.removeItem(CONSTS.AUDIO_MUTE);
          UTILS.hideContainer(welcomeContainer);
        }
      }
    }
  }

  getEventsMouseOver(event: Event): void {
    if (event.target instanceof Element) {
      const level1 = event.target.closest('.level1') as HTMLElement;
      const level2 = event.target.closest('.level2') as HTMLElement;
      const level3 = event.target.closest('.level3') as HTMLElement;
      const level4 = event.target.closest('.level4') as HTMLElement;
      const level5 = event.target.closest('.level5') as HTMLElement;
      const level6 = event.target.closest('.level6') as HTMLElement;
    
      if (level1) {
        UTILS.mouseOverElement(level1);
      }

      if (level2) {
        UTILS.mouseOverElement(level2);
      }

      if (level3) {
        UTILS.mouseOverElement(level3);
      }

      if (level4) {
        UTILS.mouseOverElement(level4);
      }

      if (level5) {
        UTILS.mouseOverElement(level5);
      }

      if (level6) {
        UTILS.mouseOverElement(level6);
      }
    }
  }

  getEventsMouseOut(event: Event): void {
    if (event.target instanceof Element) {
      const level1 = event.target.closest('.level1') as HTMLElement;
      const level2 = event.target.closest('.level2') as HTMLElement;
      const level3 = event.target.closest('.level3') as HTMLElement;
      const level4 = event.target.closest('.level4') as HTMLElement;
      const level5 = event.target.closest('.level5') as HTMLElement;
      const level6 = event.target.closest('.level6') as HTMLElement;
    
      if (level1) {
        UTILS.mouseOutElement();
      }

      if (level2) {
        UTILS.mouseOutElement();
      }

      if (level3) {
        UTILS.mouseOutElement();
      }

      if (level4) {
        UTILS.mouseOutElement();
      }

      if (level5) {
        UTILS.mouseOutElement();
      }

      if (level6) {
        UTILS.mouseOutElement();
      }
    }
  }

  afterInit() {
    const container = document.querySelector('.welcome-container');
    container.addEventListener('click', this.getEventsClick.bind(this));
    container.addEventListener('mouseover', this.getEventsMouseOver.bind(this));
    container.addEventListener('mouseout', this.getEventsMouseOut.bind(this));
  }
}

export const appSelectDifficulty = new AppSelectDifficulty({
  selector: 'app-select-difficulty',
  template: SelectDifficulty,
});
