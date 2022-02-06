import { Component } from '../../../spa';
import Sprint from './sprint.component.html';
import './sprint.component.scss';
import { appHeader } from '../../components/header/app.header';
import UTILS from './utils';
import CONSTS from './consts';

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

      if (buttonStartSprint) {
        const welcomeContainer = document.querySelector('.welcome-container') as HTMLElement;
        const group: string = UTILS.getGroup();
        const page: string = String(UTILS.randomNumber(CONSTS.MIN_PAGE, CONSTS.MAX_PAGE));
        console.log(group, page);

        UTILS.hideContainer(welcomeContainer);
        UTILS.showStopwatch(group, page);
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
