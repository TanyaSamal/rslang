import { Component } from '../../../spa';
import Sprint from './sprint.component.html';
import './sprint.component.scss';
import { appHeader } from '../../components/header/app.header';
import { activateButton, changeStyleElement, mouseOutElement, mouseOverElement, resetStyleElement } from './utils';

class SprintComponent extends Component {
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
        resetStyleElement();
        changeStyleElement(level1);
        activateButton();
      }

      if (level2) {
        resetStyleElement();
        changeStyleElement(level2);
        activateButton();
      }

      if (level3) {
        resetStyleElement();
        changeStyleElement(level3);
        activateButton();
      }

      if (level4) {
        resetStyleElement();
        changeStyleElement(level4);
        activateButton();
      }

      if (level5) {
        resetStyleElement();
        changeStyleElement(level5);
        activateButton();
      }

      if (level6) {
        resetStyleElement();
        changeStyleElement(level6);
        activateButton();
      }

      if (buttonStartSprint) {
        // startGameSprint();
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
        mouseOverElement(level1);
      }

      if (level2) {
        mouseOverElement(level2);
      }

      if (level3) {
        mouseOverElement(level3);
      }

      if (level4) {
        mouseOverElement(level4);
      }

      if (level5) {
        mouseOverElement(level5);
      }

      if (level6) {
        mouseOverElement(level6);
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
        mouseOutElement(level1);
      }

      if (level2) {
        mouseOutElement(level2);
      }

      if (level3) {
        mouseOutElement(level3);
      }

      if (level4) {
        mouseOutElement(level4);
      }

      if (level5) {
        mouseOutElement(level5);
      }

      if (level6) {
        mouseOutElement(level6);
      }
    }
  }
}

export const sprintComponent = new SprintComponent({
  selector: 'app-sprint',
  components: [
    appHeader
  ],
  template: Sprint,
});

document.addEventListener('click', sprintComponent.getEventsClick);
document.addEventListener('mouseover', sprintComponent.getEventsMouseOver);
document.addEventListener('mouseout', sprintComponent.getEventsMouseOut);
