import { Component, Controller } from '../../../spa';
import Textbook from './textbook.component.html';
import './textbook.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { AppWord } from '../../components/word/app.word';
import Word from '../../components/word/app.word.html';
import { IWord } from '../../../spa/tools/controllerTypes';
import { ComponentEvent } from '../../../spa/core/coreTypes';

const BASE_URL = 'https://rslang-2022.herokuapp.com/';

class TextbookComponent extends Component {
  private controller = new Controller();

  private currentPage = 0;

  private currentLevel = '0';

  private pageWords : IWord[] = [];

  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.pagination-list',
    listener: this.changePage,
  },
  {
    event: 'click',
    className: '.prev-page',
    listener: this.goToPrevPage,
  },
  {
    event: 'click',
    className: '.next-page',
    listener: this.goToNextPage,
  }];

  channgePaginationView(): void {
    const pagination = <HTMLUListElement>document.querySelector('.pagination-list');
    const oldCurrPage = <HTMLButtonElement>pagination.querySelector('.current-page');
    const firstPart = <HTMLButtonElement>pagination.querySelector('.first-part');
    if (oldCurrPage) oldCurrPage.classList.remove('current-page');
    if (this.currentPage < 27 && this.currentPage > 0) {
      firstPart.classList.remove('hide');
      if (this.currentPage === 1 && !firstPart.classList.contains('hide')) firstPart.classList.add('hide');
      if (this.currentPage === 2) {
        (<HTMLButtonElement>pagination.children[1].lastElementChild).classList.add('hide');
      } else {
        (<HTMLButtonElement>pagination.children[1].lastElementChild).classList.remove('hide');
      }
      if (this.currentPage === 26) {
        (<HTMLButtonElement>pagination.children[5]).classList.add('hide');
      } else {
        (<HTMLButtonElement>pagination.children[5]).classList.remove('hide');
      }
      pagination.children[2].firstElementChild.textContent = `${this.currentPage}`;
      pagination.children[3].firstElementChild.textContent = `${this.currentPage + 1}`;
      pagination.children[4].firstElementChild.textContent = `${this.currentPage + 2}`;
      (<HTMLButtonElement>pagination.children[3].firstElementChild).classList.add('current-page');
    }
    if (this.currentPage === 0) {
      firstPart.classList.add('hide');
      if ((<HTMLButtonElement>pagination.children[5]).classList.contains('hide'))
        (<HTMLButtonElement>pagination.children[5]).classList.remove('hide');
      (<HTMLButtonElement>pagination.children[2].firstElementChild).classList.add('current-page');
      pagination.children[2].firstElementChild.textContent = `${this.currentPage + 1}`;
      pagination.children[3].firstElementChild.textContent = `${this.currentPage + 2}`;
      pagination.children[4].firstElementChild.textContent = `${this.currentPage + 3}`;
    }
    if (this.currentPage >= 27) {
      if(this.currentPage === 27) {
        (<HTMLButtonElement>pagination.children[4].firstElementChild).classList.add('current-page');
        (<HTMLButtonElement>pagination.children[5]).classList.add('hide');
      } else {
        (<HTMLButtonElement>pagination.children[this.currentPage - 22].firstElementChild).classList.add('current-page');
        pagination.children[2].firstElementChild.textContent = `${this.currentPage - 2}`;
        pagination.children[3].firstElementChild.textContent = `${this.currentPage - 1}`;
        pagination.children[4].firstElementChild.textContent = `${this.currentPage}`;
        (<HTMLButtonElement>pagination.children[5]).classList.add('hide');
        firstPart.classList.remove('hide');
      }
    }
    (<HTMLButtonElement>pagination.lastElementChild.firstElementChild).disabled = (this.currentPage === 29);
    (<HTMLButtonElement>pagination.firstElementChild.firstElementChild).disabled = (this.currentPage === 0);
  }

  changeLevelView(): void {
    document.querySelector('.active-level').classList.remove('active-level');
    document.querySelector(`#level-${this.currentLevel}`).classList.add('active-level');
  }

  savePageInLocalStorage(): void {
    localStorage.setItem('currentPage', JSON.stringify({
      level: this.currentLevel,
      page: this.currentPage
    }));
  }

  async changePage(event: MouseEvent) {
    const target = <HTMLButtonElement>event.target;
    if (target.classList.contains('pag-number')) {
      this.currentPage = Number(target.textContent) - 1;
      this.channgePaginationView();
      await this.initLevelWords();
      this.addLevelListeners();
      this.savePageInLocalStorage();
    }
  }

  async goToPrevPage() {
    this.currentPage -= 1;
    this.channgePaginationView();
    await this.initLevelWords();
    this.addLevelListeners();
    this.savePageInLocalStorage();
  }

  async goToNextPage() {
    this.currentPage += 1;
    this.channgePaginationView();
    await this.initLevelWords();
    this.addLevelListeners();
    this.savePageInLocalStorage();
  }

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
    this.pageWords = await this.controller.getWords(this.currentLevel, this.currentPage.toString());
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
    if (localStorage.getItem('currentPage')) {
      const storageData = JSON.parse(localStorage.getItem('currentPage'));
      this.currentPage = storageData.page;
      this.currentLevel = storageData.level;
      this.changeLevelView();
      this.changeColorTheme();
      this.channgePaginationView();
    }
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
