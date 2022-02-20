import { Component, router } from '../../../spa';
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
      const fullscreen = event.target.closest('.fullscreen') as HTMLElement;
      const close = event.target.closest('.fa-window-close') as HTMLElement;
      const buttonTrue = event.target.closest('.button-true') as HTMLElement;
      const buttonFalse = event.target.closest('.button-false') as HTMLElement;
      const audioWord = event.target.closest('.word-sound') as HTMLElement;
      const gameAgain = event.target.closest('.game-again') as HTMLElement;

      if (buttonStartSprint) {
        CONSTS.SOUND_CLICK.play();
        if (!localStorage[CONSTS.SPRINT_STATE]) {
          const group: string = UTILS.getGroup();
          const page = String(UTILS.randomNumber(CONSTS.MIN_PAGE, CONSTS.MAX_PAGE));
          UTILS.showStopwatch(group, page);
        } else {
          UTILS.showStopwatch();
        }
      }

      if (volume) {
        CONSTS.SOUND_CLICK.play();
        volume.classList.toggle('volume-mute');
        
        if (volume.classList.contains('volume-mute')) {
          localStorage.setItem(CONSTS.AUDIO_MUTE, 'true');
          CONSTS.SOUND_TIME.pause();
        } else {
          localStorage.removeItem(CONSTS.AUDIO_MUTE);
          CONSTS.SOUND_TIME.play();
        }
      }

      if (fullscreen) {
        fullscreen.classList.toggle('fullscreen-off');

        if (fullscreen.classList.contains('fullscreen-off')) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }

      if (close) {
        CONSTS.SOUND_CLICK.play();
        UTILS.closeGame();
      }

      if (audioWord) {
        UTILS.playAudioWord();
      }

      if (buttonTrue) {
        localStorage.setItem(CONSTS.ANSWER, CONSTS.TRUE);
        UTILS.checkAnswer();

        const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
        const currentCard = Number(localStorage[CONSTS.CURRENT_CARD]);
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
        const currentCard = Number(localStorage[CONSTS.CURRENT_CARD]);
        const newCard: number = currentCard + 1;
        
        if (newCard < words.length) {
          localStorage.setItem(CONSTS.CURRENT_CARD, String(newCard));
          UTILS.makeNextWordCard();
        } else {
          UTILS.makeNextPage();
        }
      }

      if (gameAgain) {
        CONSTS.SOUND_CLICK.play();
        const resultGameContainer = document.querySelector('.result-game-container') as HTMLElement;
        UTILS.hideContainer(resultGameContainer);
        
        router.navigate('#');

        if (localStorage[CONSTS.SPRINT_STATE]) {
          router.navigate('_sprint');
        } else {
          router.navigate('sprint');
        }
      }
    }
  }

  getEventsKeyDown(event: KeyboardEvent): void {
    if (event.key === CONSTS.KEYS.arrowLeft) {
      localStorage.setItem(CONSTS.ANSWER, CONSTS.FALSE);
      UTILS.checkAnswer();

      const words: IWord[] = JSON.parse(localStorage[CONSTS.WORDS]);
      const currentCard = Number(localStorage[CONSTS.CURRENT_CARD]);
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
      const currentCard = Number(localStorage[CONSTS.CURRENT_CARD]);
      const newCard: number = currentCard + 1;
      
      if (newCard < words.length) {
        localStorage.setItem(CONSTS.CURRENT_CARD, String(newCard));
        UTILS.makeNextWordCard();
      } else {
        UTILS.makeNextPage();
      }
    }
  }

  afterInit() {
    const container = document.querySelector('.sprint-page-container');
    container.addEventListener('click', this.getEventsClick.bind(this));
    document.addEventListener('keyup', this.getEventsKeyDown.bind(this));
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
