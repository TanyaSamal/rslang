import './app.select-difficulty.scss';
import SelectDifficulty from './app.select-difficulty.html';
import { Component } from '../../../spa';
import UTILS from './app.select-difficulty-utils';

const SPRINT_STATE: string = 'sprintState';

class AppSelectDifficulty extends Component {
  fillContent(): void {
    const name = document.querySelector('.game-name') as HTMLElement;
    const description = document.querySelector('.game-description') as HTMLElement;
  
    name.innerHTML = appSelectDifficulty.nameGame;
    description.innerHTML = appSelectDifficulty.descriptionGame;
  }

  checkSourceWords(): void {
    const dictionary = document.querySelector('.dictionary') as HTMLElement;
    const difficulty = document.querySelector('.difficulty') as HTMLElement;

    if (localStorage[SPRINT_STATE]) {
      dictionary.classList.remove('hide');
      UTILS.activateButton();
    } else {
      difficulty.classList.remove('hide');
    }
  }

  getEventsClick(event: Event): void {
    if (event.target instanceof Element) {
      const level1 = event.target.closest('.level1') as HTMLElement;
      const level2 = event.target.closest('.level2') as HTMLElement;
      const level3 = event.target.closest('.level3') as HTMLElement;
      const level4 = event.target.closest('.level4') as HTMLElement;
      const level5 = event.target.closest('.level5') as HTMLElement;
      const level6 = event.target.closest('.level6') as HTMLElement;
    
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
        UTILS.mouseOutElement(level1);
      }

      if (level2) {
        UTILS.mouseOutElement(level2);
      }

      if (level3) {
        UTILS.mouseOutElement(level3);
      }

      if (level4) {
        UTILS.mouseOutElement(level4);
      }

      if (level5) {
        UTILS.mouseOutElement(level5);
      }

      if (level6) {
        UTILS.mouseOutElement(level6);
      }
    }
  }
}

export const appSelectDifficulty = new AppSelectDifficulty({
  selector: 'app-select-difficulty',
  template: SelectDifficulty,
});

document.addEventListener('DOMContentLoaded', appSelectDifficulty.fillContent);
document.addEventListener('DOMContentLoaded', appSelectDifficulty.checkSourceWords);

document.addEventListener('click', appSelectDifficulty.getEventsClick);
document.addEventListener('mouseover', appSelectDifficulty.getEventsMouseOver);
document.addEventListener('mouseout', appSelectDifficulty.getEventsMouseOut);
