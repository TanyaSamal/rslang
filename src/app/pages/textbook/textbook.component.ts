import { Component, Controller } from '../../../spa';
import Textbook from './textbook.component.html';
import './textbook.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { AppWord } from '../../components/word/app.word';
import Word from '../../components/word/app.word.html';
import { IWord } from '../../../spa/tools/controllerTypes';

const BASE_URL = 'https://rslang-2022.herokuapp.com/';

class TextbookComponent extends Component {
  private controller = new Controller();

  private currentPage = '0';

  private currentLevel = '0';

  private pageWords : IWord[] = [];

  addAudio(idx: number): void {
    const playAudio = (src: string) => {
      const audio = new Audio(`${BASE_URL + src}`);
      audio.play();
      audio.onended = () => {
        switch (src) {
          case this.pageWords[idx].audio:
            playAudio(this.pageWords[idx].audioMeaning);
            break;
          case this.pageWords[idx].audioMeaning:
            playAudio(this.pageWords[idx].audioExample);
            break;
          default:
            break;
        }
      };
    }

    const playAudios = (): void => {
      playAudio(this.pageWords[idx].audio);
    }

    const audioBtn = document.querySelector('.play-audio');
    audioBtn.addEventListener('click', playAudios);
  }

  drawActiveWord(idx: number): void {
    const wordTepmlate = document.querySelector('app-word');
    wordTepmlate.innerHTML = '';
    const appWord = new AppWord({
      selector: 'app-word',
      template: Word,
      wordData: {...this.pageWords[idx]},
    });
    const word = document.querySelector('app-word');
    word.innerHTML = appWord.template;
    appWord.render('app-word');

    const wordImage = <HTMLDivElement>document.querySelector('.word-image');
    wordImage.style.backgroundImage = `url('${BASE_URL + this.pageWords[idx].image}')`;

    const activeWord = <HTMLDivElement>document.querySelector('.active-card');
    if (activeWord) activeWord.classList.remove('active-card');
    const wordLink = <HTMLDivElement>document.querySelector(`#word${idx}`);
    wordLink.classList.add('active-card');

    this.addAudio(idx);
  }

  addWordsListeners(): void {
    const showWordInfo = (event: MouseEvent): void => {
      const target = <HTMLDivElement>event.target;
      const parentDiv = <HTMLDivElement>target.closest('div');
      if (parentDiv && parentDiv.contains(target)) {
        const targetId = Number(parentDiv.id.slice(parentDiv.id.indexOf('word') + 4));
        this.drawActiveWord(targetId);
      }
    }
    const wordsContainer = document.querySelector('.words-container');
    wordsContainer.addEventListener('click', showWordInfo);
  }

  async initLevelWords(): Promise<void> {
    this.pageWords.length = 0;
    this.pageWords = await this.controller.getWords(this.currentPage, this.currentLevel);
    this.pageWords.sort((wordItem1, wordItem2) => {
      if (wordItem1.word > wordItem2.word) return 1;
      if (wordItem1.word < wordItem2.word) return -1;
      return 0;
    });
    this.drawWords();
    this.addWordsListeners();
    document.querySelector('.word-description').innerHTML = '';
    document.querySelector('.word-description').insertAdjacentHTML('afterbegin',
      `<app-word></app-word>`);
    this.drawActiveWord(0);
  }

  changeColorTheme(): void {
    const wordsContainer = document.querySelector('.words-content');
    wordsContainer.className = `words-content colorTheme-${this.currentLevel}`;
  }

  addLevelListeners(): void {
    const changeLevel = async (event: MouseEvent) => {
      const target = <HTMLDivElement>event.target;
      const parentDiv = <HTMLDivElement>target.closest('.difficulty-level');
      if (parentDiv && parentDiv.contains(target)) {
        this.currentLevel = parentDiv.id.slice(parentDiv.id.length - 1);
        const activLevel = document.querySelector('.active-level');
        if (activLevel) activLevel.classList.remove('active-level');
        parentDiv.classList.add('active-level');
        await this.initLevelWords();
        this.changeColorTheme();
      }
    }
    const levelsContainer = document.querySelector('.difficulty-levels');
    levelsContainer.addEventListener('click', changeLevel); 
  }

  drawWords(): void {
    const fragment = document.createDocumentFragment() as DocumentFragment;
    const wordItemTemp = document.querySelector('#word-item-temp') as HTMLTemplateElement;

    this.pageWords.forEach((item: IWord, idx: number): void => {
        const newsClone = <HTMLElement>wordItemTemp.content.cloneNode(true);
        newsClone.querySelector('.word-card').id=`word${idx}`;
        newsClone.querySelector('.word-en').textContent = item.word;
        newsClone.querySelector('.word-ru').textContent = item.wordTranslate;
        fragment.append(newsClone);
    });

    document.querySelector('.words-container').innerHTML = '';
    document.querySelector('.words-container').appendChild(fragment);
  }

  async afterInit() {
    await this.initLevelWords();
    this.addLevelListeners();
  }
}

export const textbookComponent = new TextbookComponent({
  selector: 'app-textbook',
  components: [
    appHeader,
    appFooter
  ],
  template: Textbook,
});
