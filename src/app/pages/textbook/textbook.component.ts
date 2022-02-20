import { Component, Controller, router } from '../../../spa';
import Textbook from './textbook.component.html';
import './textbook.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { AppWord } from '../../components/word/app.word';
import Word from '../../components/word/app.word.html';
import { IAuth, IStatistics, IUserWordInfo, IWord, WordStatus } from '../../../spa/tools/controllerTypes';
import { ComponentEvent } from '../../../spa/core/coreTypes';
import { IPageState, Mode } from '../../componentTypes';
import * as utils from './utils';
import { makeStatistic } from '../audiocall/utils';

const BASE_URL = 'https://rslang-2022.herokuapp.com/';
const WORDS_ON_PAGE = 20;

class TextbookComponent extends Component {
  private controller = new Controller();
  private currentPage = 0;
  private currentDictPage = 0;
  private currentMode = Mode.TEXTBOOK;
  private currentState = WordStatus.difficult;
  private currentLevel = '0';
  private pageWords: IWord[] = [];
  private userWords: IWord[] = [];
  private difficultWords: IUserWordInfo[] = [];
  private learntWords: IUserWordInfo[] = [];
  private newWords: IUserWordInfo[] = [];
  private userWordsInfo: IUserWordInfo[] = [];
  private isTranslateShown = true;
  private isWordButtonsShown = true;

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
  },
  {
    event: 'click',
    className: '.pagination-dict__list',
    listener: this.changeDictPage,
  },
  {
    event: 'click',
    className: '.prev-dict__page',
    listener: this.goToPrevDictPage,
  },
  {
    event: 'click',
    className: '.next-dict__page',
    listener: this.goToNextDictPage,
  },
  {
    event: 'click',
    className: '#dictionary-title',
    listener: this.showDictionary,
  },
  {
    event: 'click',
    className: '#textbook-title',
    listener: this.showTextbook,
  },
  {
    event: 'click',
    className: '.difficult-words',
    listener: this.showDifficultWords,
  },
  {
    event: 'click',
    className: '.learnt-words',
    listener: this.showLearntWords,
  },
  {
    event: 'click',
    className: '.new-words',
    listener: this.showNewWords,
  },
  {
    event: 'click',
    className: '.game-sprint',
    listener: this.goToSpring,
  },
  {
    event: 'click',
    className: '.game-audiocall',
    listener: this.goToAudioCall,
  },
  {
    event: 'click',
    className: '.settings-svg',
    listener: this.showSettings,
  },
  {
    event: 'click',
    className: '.close-settings__btn',
    listener: this.closeSettings,
  },
  {
    event: 'click',
    className: '#checkbox-translate',
    listener: this.toggleTranslate,
  },
  {
    event: 'click',
    className: '#checkbox-buttons',
    listener: this.toggleButtons,
  }
];

  toggleButtons() {
    this.isWordButtonsShown = !this.isWordButtonsShown;
    utils.updateWordButtonsView(this.isWordButtonsShown );
  }

  toggleTranslate() {
    this.isTranslateShown = !this.isTranslateShown;
    utils.updateTranslateView(this.isTranslateShown);
  }

  closeSettings() {
    (<HTMLDivElement>document.querySelector('.textbook-setting')).style.opacity = '0';
    (<SVGElement>document.querySelector('.settings-svg')).style.zIndex = '2';
  }

  showSettings() {
    (<HTMLDivElement>document.querySelector('.textbook-setting')).style.opacity = '1';
    (<SVGElement>document.querySelector('.settings-svg')).style.zIndex = '1';
  }

  saveStateInLocalStorage(setItem: string) {
    localStorage.setItem(setItem, JSON.stringify({
      mode: this.currentMode,
      state: this.currentState,
      level: this.currentLevel,
      textbookPage: this.currentPage,
      dictionaryPage: this.currentDictPage,
      textbookWords: this.pageWords,
      dictionaryWords: this.userWords
    }));
  }

  savePageInLocalStorage() {
    localStorage.setItem('currentPage', JSON.stringify({
      mode: this.currentMode,
      state: this.currentState,
      level: this.currentLevel,
      textbookPage: this.currentPage,
      dictionaryPage: this.currentDictPage,
      isWordButtonsShown: this.isWordButtonsShown,
      isTranslateShown: this.isTranslateShown,
    }));
  }

  goToAudioCall() {
    router.navigate('_audiocall');
    this.saveStateInLocalStorage('audiocallState');
  }

  goToSpring() {
    router.navigate('_sprint');
    this.saveStateInLocalStorage('sprintState');
  }

  changeDictPaginationState() {
    let pagesCount = 1;
    if (this.currentState === WordStatus.difficult) {
      pagesCount = utils.culcPagesCount(this.difficultWords.length);
    } else if (this.currentState === WordStatus.learnt) {
      pagesCount = utils.culcPagesCount(this.learntWords.length);
    } else {
      pagesCount = utils.culcPagesCount(this.newWords.length);
    }
    this.drawActiveWord(this.currentDictPage * WORDS_ON_PAGE);
    if (pagesCount !== 0) this.drawDictionaryPagination(this.currentDictPage + 1, pagesCount);
    document.querySelector('.current-dict__page').classList.remove('current-dict__page');
    const newCurrent = document.querySelector(`[aria-label="page ${this.currentDictPage + 1}"]`);
    newCurrent.classList.add('current-dict__page');
    const wordContainer = <HTMLDivElement>document.querySelector('.dictionary-words__container');
    const containerWidth = wordContainer.getBoundingClientRect().width;
    const MARGIN = (containerWidth > 1000) ? 592 : 480;
    wordContainer.style.marginTop = `-${MARGIN * this.currentDictPage}px`;
  }

  changeDictPage(event: MouseEvent) {
    const target = <HTMLButtonElement>event.target;
    if (target.classList.contains('pag-number') && target.textContent !== '...') {
      this.currentDictPage = Number(target.textContent) - 1;
      this.changeDictPaginationState();
    }
  }

  goToPrevDictPage() {
    this.currentDictPage -= 1;
    this.changeDictPaginationState();
  }

  goToNextDictPage() {
    this.currentDictPage += 1;
    this.changeDictPaginationState();
  }

  async sendStatistic(userId: string, token: string) {
    const currentStatistic: IStatistics = await this.controller.getStatistics(userId, token);
    const newStatistic = makeStatistic(currentStatistic);
    await this.controller.setStatistics(userId, token, newStatistic);
  }

  async deleteFromDifficult(target: Element) {
    const wordCard = <HTMLDivElement>target.closest('.word-card');
    const wordIdx = wordCard.id.slice(Mode.DICTIONARY.length);
    const wordId = this.userWords[+wordIdx].id;
    const userInfo: IAuth = JSON.parse(window.localStorage.getItem('userInfo'));
    const userWordInfo: IUserWordInfo = await this.controller.getUserWordById(userInfo.userId, userInfo.token, wordId);
    userWordInfo.optional.status = WordStatus.learnt;
    userWordInfo.optional.updatedDate = new Date().toLocaleDateString();
    delete userWordInfo.id;
    delete userWordInfo.wordId;
    await this.controller.updateUserWord(userInfo.userId, userInfo.token, wordId, userWordInfo);
    await this.sendStatistic(userInfo.userId, userInfo.token);
    const deletedWordInfo = this.difficultWords.filter((word) => word.wordId === wordId);
    if (deletedWordInfo[0]) this.learntWords.push(deletedWordInfo[0]);
    this.difficultWords = this.difficultWords.filter((word) => word.wordId !== wordId);
    this.userWords = this.userWords.filter((word) => word.id !== wordId);
    if (this.difficultWords.length % WORDS_ON_PAGE === 0) {
      if (this.currentDictPage >= 1) this.currentDictPage -= 1;
      if (this.difficultWords.length !== 0) this.changeDictPaginationState();
    }
    this.drawDictionaryWords(this.difficultWords, this.userWords);
    const deleteDifficultBtn = document.querySelectorAll('.delete-difficult');
    deleteDifficultBtn.forEach((deleteBtn: SVGElement) => {
      deleteBtn.style.display = 'block';
    });
    utils.changeUserWordsCount(this.difficultWords.length, this.learntWords.length, this.newWords.length);
  }

  drawDictionaryWords(wordsArr: IUserWordInfo[], drawnArray: IWord[]) {
    const dictionaryContainer = document.querySelector('.dictionary-words__container');
    if (wordsArr.length !== 0) {
      dictionaryContainer.innerHTML = '';
      const fragment = this.createFragment(drawnArray);
      dictionaryContainer.appendChild(fragment);
      document.querySelector('.dictionary-word__description').innerHTML = '';
      document.querySelector('.dictionary-word__description').insertAdjacentHTML('afterbegin',
        `<app-word></app-word>`);
      this.drawActiveWord(this.currentDictPage * WORDS_ON_PAGE);
    } else {
      dictionaryContainer.innerHTML = 'В разделе пока нет слов.';
      document.querySelector('.dictionary-word__description').innerHTML = '';
      (<HTMLElement>document.querySelector('.dictionary-pagination')).style.display = 'none';
    }
  }

  async getFilteredDictionary(arr: IUserWordInfo[]): Promise<IWord[]> {
    this.userWords.length = 0;
    const wordIDs: string[] = [];
    arr.forEach((word) => wordIDs.push(word.wordId));
    const promices = wordIDs.map((id) => this.controller.getWordById(id));
    return Promise.all(promices);
  }

  drawDictionaryPagination(currentPage: number, pagesCount: number) {
    if (pagesCount === 0) {
      (<HTMLDivElement>document.querySelector('.dictionary-pagination')).style.display = 'none';
    } else {
      (<HTMLDivElement>document.querySelector('.dictionary-pagination')).style.display = 'flex';
      const paginationList = utils.createPaginationView(currentPage, pagesCount);
      document.querySelector('.pagination-dict__list').innerHTML = paginationList.trim();
      document.querySelector('.pagination-dict__list li:first-child button')?.classList.add('current-dict__page');
      if (pagesCount === 1 || pagesCount === currentPage) {
        (<HTMLButtonElement>document.querySelector('.next-dict__page')).disabled = true;
      } else {
        (<HTMLButtonElement>document.querySelector('.next-dict__page')).disabled = false;
      }
      if (currentPage > 1) {
        (<HTMLButtonElement>document.querySelector('.prev-dict__page')).disabled = false;
      } else {
        (<HTMLButtonElement>document.querySelector('.prev-dict__page')).disabled = true;
      }
    }
  }

  async showNewWords() {
    utils.showDictionaryLoader();
    this.currentState = WordStatus.inProgress;
    this.currentDictPage = 0;
    (<HTMLDivElement>document.querySelector('.dictionary-words__container')).style.marginTop = '0px';
    document.querySelector('.active-state').classList.remove('active-state');
    const target = <HTMLDivElement>document.querySelector('.new-words');
    target.classList.add('active-state');

    const usersDifficulty = document.querySelectorAll('.users-difficulty');
    (<HTMLParagraphElement>usersDifficulty[0]).classList.add('hide');
    (<HTMLParagraphElement>usersDifficulty[1]).classList.add('hide');
    (<HTMLParagraphElement>usersDifficulty[2]).classList.remove('hide');

    this.userWords = await this.getFilteredDictionary(this.newWords);
    this.drawDictionaryWords(this.newWords, this.userWords);
    const pagesCount = utils.culcPagesCount(this.newWords.length);
    this.drawDictionaryPagination(1, pagesCount);

    const gameLinks = document.querySelectorAll('.link-container');
    gameLinks.forEach((link: HTMLDivElement) => {
      if (this.newWords.length !== 0) {
        if (link.classList.contains('disabled')) link.classList.remove('disabled');
      }
      else link.classList.add('disabled');
    });
    this.savePageInLocalStorage();
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(false);
    utils.hideDictionaryLoader();
  }

  async showDifficultWords(event?: MouseEvent) {
    this.currentState = WordStatus.difficult;
    this.currentDictPage = 0;
    (<HTMLDivElement>document.querySelector('.dictionary-words__container')).style.marginTop = '0px';
    if (event) {
      document.querySelector('.active-state').classList.remove('active-state');
      const target = <HTMLDivElement>event.target;
      target.closest('.user-words').classList.add('active-state');
    }
    const usersDifficulty = document.querySelectorAll('.users-difficulty');
    (<HTMLParagraphElement>usersDifficulty[0]).classList.remove('hide');
    (<HTMLParagraphElement>usersDifficulty[1]).classList.add('hide');
    (<HTMLParagraphElement>usersDifficulty[2]).classList.add('hide');

    this.userWords = await this.getFilteredDictionary(this.difficultWords);
    this.drawDictionaryWords(this.difficultWords, this.userWords);
    const deleteDifficultBtn = document.querySelectorAll('.delete-difficult');
    deleteDifficultBtn.forEach((deleteBtn: SVGElement) => {
      deleteBtn.style.display = 'block';
    });
    const pagesCount = utils.culcPagesCount(this.difficultWords.length);
    
    this.drawDictionaryPagination(1, pagesCount);

    const gameLinks = document.querySelectorAll('.link-container');
    gameLinks.forEach((link: HTMLDivElement) => {
      if (this.difficultWords.length !== 0) {
        if (link.classList.contains('disabled')) link.classList.remove('disabled');
      }
      else link.classList.add('disabled');
    });
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(false);
    this.savePageInLocalStorage();
  }

  async showLearntWords() {
    utils.showDictionaryLoader();
    this.currentState = WordStatus.learnt;
    this.currentDictPage = 0;
    (<HTMLDivElement>document.querySelector('.dictionary-words__container')).style.marginTop = '0px';
    document.querySelector('.active-state').classList.remove('active-state');
    const target = <HTMLDivElement>document.querySelector('.learnt-words');
    target.classList.add('active-state');

    const usersDifficulty = document.querySelectorAll('.users-difficulty');
    (<HTMLParagraphElement>usersDifficulty[0]).classList.add('hide');
    (<HTMLParagraphElement>usersDifficulty[1]).classList.remove('hide');
    (<HTMLParagraphElement>usersDifficulty[2]).classList.add('hide');

    this.userWords = await this.getFilteredDictionary(this.learntWords);
    this.drawDictionaryWords(this.learntWords, this.userWords);
    const pagesCount = utils.culcPagesCount(this.learntWords.length);
    
    this.drawDictionaryPagination(1, pagesCount);

    const gameLinks = document.querySelectorAll('.link-container');
    gameLinks.forEach((link: HTMLDivElement) => {
      link.classList.add('disabled');
    });
    this.savePageInLocalStorage();
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(false);
    utils.hideDictionaryLoader();
  }

  async getDictionaryWords() {
    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    this.userWordsInfo = await this.controller.getUserWords(userInfo.userId, userInfo.token);
  }

  getFilteredWords() {
    this.learntWords.length = 0;
    this.difficultWords.length = 0;
    this.newWords.length = 0;
    this.learntWords = this.userWordsInfo.filter((word) =>
      word.difficulty === this.currentLevel && word.optional.status === WordStatus.learnt);
    this.difficultWords = this.userWordsInfo.filter((word) =>
      word.difficulty === this.currentLevel && word.optional.status === WordStatus.difficult);
    this.newWords = this.userWordsInfo.filter((word) =>
      word.difficulty === this.currentLevel && word.optional.status === WordStatus.inProgress);
  }

  async showTextbook() {
    utils.showLoader();
    utils.switchMode(Mode.TEXTBOOK);
    this.currentMode = Mode.TEXTBOOK;
    const gameLinks = document.querySelectorAll('.link-container');
    gameLinks.forEach((link: HTMLDivElement) => {
      if (link.classList.contains('disabled')) link.classList.remove('disabled');
    });
    await this.initLevelWords();
    document.querySelector('.dictionary-word__description').innerHTML = '';
    const activeWord = JSON.parse(localStorage.getItem('activeWord'));
    this.drawActiveWord(+activeWord);
    this.savePageInLocalStorage();
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(this.isWordButtonsShown);
    utils.hideLoader();
  }

  async showDictionary() {
    utils.showDictionaryLoader();
    await this.getDictionaryWords();
    utils.switchMode(Mode.DICTIONARY);
    this.currentMode = Mode.DICTIONARY;
    this.getFilteredWords();
    utils.changeUserWordsCount(this.difficultWords.length, this.learntWords.length, this.newWords.length);
    document.querySelector('.active-state').classList.remove('active-state');
    document.querySelector('.difficult-words').classList.add('active-state');
    const gameLinks = document.querySelectorAll('.link-container');
    gameLinks.forEach((link: HTMLDivElement) => {
      if (link.classList.contains('disabled')) link.classList.remove('disabled');
    });
    if (JSON.parse(localStorage.getItem('currentPage')).state === WordStatus.learnt)
      await this.showLearntWords();
    else if (JSON.parse(localStorage.getItem('currentPage')).state === WordStatus.difficult)
      await this.showDifficultWords();
    else
      await this.showNewWords();
    this.savePageInLocalStorage();
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(false);
    utils.hideDictionaryLoader();
  }

  changeLevelView(): void {
    document.querySelector('.active-level').classList.remove('active-level');
    document.querySelector(`#level-${this.currentLevel}`).classList.add('active-level');
    this.savePageInLocalStorage();
  }

  async changePage(event: MouseEvent) {
    const target = <HTMLButtonElement>event.target;
    if (target.classList.contains('pag-number')) {
      utils.showLoader();
      this.currentPage = Number(target.textContent) - 1;
      await this.initLevelWords();
      utils.channgePaginationView(this.currentPage);
      utils.checkPageProgress(this.currentMode);
      utils.hideLoader();
      utils.updateTranslateView(this.isTranslateShown);
      utils.updateWordButtonsView(this.isWordButtonsShown);
      this.savePageInLocalStorage();
    }
  }

  async goToPrevPage() {
    utils.showLoader();
    this.currentPage -= 1;
    await this.initLevelWords();
    utils.channgePaginationView(this.currentPage);
    utils.checkPageProgress(this.currentMode);
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(this.isWordButtonsShown);
    this.savePageInLocalStorage();
    utils.hideLoader();
  }

  async goToNextPage() {
    utils.showLoader();
    this.currentPage += 1;
    await this.initLevelWords();
    utils.checkPageProgress(this.currentMode);
    utils.channgePaginationView(this.currentPage);
    utils.updateTranslateView(this.isTranslateShown);
    utils.updateWordButtonsView(this.isWordButtonsShown);
    this.savePageInLocalStorage();
    utils.hideLoader();
  }

  addAudio(idx: number): void {
    const playAudio = (src: string) => {
      const audio = new Audio(`${BASE_URL + src}`);
      audio.play();
      const currentWord = (this.currentMode === Mode.TEXTBOOK) ? this.pageWords[idx] : this.userWords[idx];
      audio.onended = () => {
        switch (src) {
          case currentWord.audio:
            playAudio(currentWord.audioMeaning);
            break;
          case currentWord.audioMeaning:
            playAudio(currentWord.audioExample);
            break;
          default:
            break;
        }
      };
    }

    const playAudios = (): void => {
      const currentAudio = (this.currentMode === Mode.TEXTBOOK) ? this.pageWords[idx].audio : this.userWords[idx].audio;
      playAudio(currentAudio);
    }

    const audioBtn = document.querySelector('.play-audio');
    audioBtn.addEventListener('click', playAudios);
  }

  async showWordStatistic(wordId: string) {
    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    const userWordInfo = await this.controller.getUserWordById(userInfo.userId, userInfo.token, wordId);
    if (userWordInfo) utils.drawGameData(userWordInfo);
  }

  drawActiveWord(idx: number): void {
    const wordTepmlate = document.querySelector('app-word');
    wordTepmlate.innerHTML = '';
    const modeWordData: IWord = (this.currentMode === Mode.TEXTBOOK) ? this.pageWords[idx] : this.userWords[idx]
    const appWord = new AppWord({
      selector: 'app-word',
      template: Word,
      wordData: {...modeWordData},
    });
    const word = document.querySelector('app-word');
    word.innerHTML = appWord.template;
    appWord.render('app-word');
    appWord.afterInit();

    const wordImage = <HTMLDivElement>document.querySelector('.word-image');
    wordImage.style.backgroundImage = `url('${BASE_URL + modeWordData.image}')`;

    if (this.currentMode === Mode.DICTIONARY) {
      (<HTMLDivElement>document.querySelector('.word-actions')).style.display = 'none';
    } else {
      window.localStorage.setItem('activeWord', JSON.stringify(idx));
    }

    if (appHeader.token) {
      this.showWordStatistic(modeWordData.id);
    }

    const activeWord = <HTMLDivElement>document.querySelector('.active-card');
    if (activeWord) activeWord.classList.remove('active-card');
    const wordLink = <HTMLDivElement>document.querySelector(`#${this.currentMode + idx}`);
    wordLink.classList.add('active-card');
    window.localStorage.setItem('activeWordID', JSON.stringify(modeWordData.id));

    this.addAudio(idx);
  }

  addWordsListeners(): void {
    const showWordInfo = async (event: MouseEvent) => {
      const target = <Element>event.target;
      const parentDiv = <HTMLDivElement>target.closest('.word-card');
      if (target.closest('.delete-difficult')) {
        await this.deleteFromDifficult(target);
        event.stopImmediatePropagation();
      } else if (parentDiv && parentDiv.contains(target)) {
        const targetId = Number(parentDiv.id.slice(parentDiv.id.indexOf(this.currentMode) + this.currentMode.length));
        this.drawActiveWord(targetId);
      }
      utils.updateTranslateView(this.isTranslateShown);
      utils.updateWordButtonsView(this.isWordButtonsShown);
    }

    const wordsContainer = document.querySelector('.words-container');
    wordsContainer.addEventListener('click', showWordInfo);
    const dictionaryContainer = document.querySelector('.dictionary-words__container');
    dictionaryContainer.addEventListener('click', showWordInfo);
  }

  createFragment(arr: IWord[]): DocumentFragment {
    const fragment = document.createDocumentFragment() as DocumentFragment;
    const wordItemTemp = document.querySelector('#word-item-temp') as HTMLTemplateElement;

    arr.forEach((item: IWord, idx: number): void => {
        const newsClone = <HTMLElement>wordItemTemp.content.cloneNode(true);
        newsClone.querySelector('.word-card').id=`${this.currentMode + idx}`;
        newsClone.querySelector('.word-en').textContent = item.word;
        newsClone.querySelector('.word-ru').textContent = item.wordTranslate;
        fragment.append(newsClone);
    });
    return fragment;
  }

  drawWords(): void {
    const fragment = this.createFragment(this.pageWords);
    document.querySelector('.words-container').innerHTML = '';
    document.querySelector('.words-container').appendChild(fragment);
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
    if (localStorage.getItem('userInfo')) {
      await this.getDictionaryWords();
      this.getFilteredWords();
      if (this.currentMode === Mode.TEXTBOOK) {
        const difficult = await this.getFilteredDictionary(this.difficultWords);
        const learnt = await this.getFilteredDictionary(this.learntWords);
        difficult.forEach((word) => {
          const idx = this.pageWords.findIndex((pageWord) => pageWord.id === word.id);
          if (idx !== -1) {
            const activBlock = <HTMLDivElement>document.querySelector(`#textbook${idx} .word-status`);
            if (activBlock) {
              activBlock.style.display = 'block';
              activBlock.lastElementChild.textContent = 'С';
            }
          }
        });
        learnt.forEach((word) => {
          const idx = this.pageWords.findIndex((pageWord) => pageWord.id === word.id);
          if (idx !== -1) {
            const activBlock = <HTMLDivElement>document.querySelector(`#textbook${idx} .word-status`);
            if (activBlock) {
              activBlock.style.display = 'block';
              activBlock.lastElementChild.textContent = 'И';
            }
          }
        });
      } else {
        switch (this.currentState) {
          case WordStatus.difficult:
            this.userWords = await this.getFilteredDictionary(this.newWords);
            break;
          case WordStatus.learnt:
            this.userWords = await this.getFilteredDictionary(this.learntWords);
            break;
          default:
            this.userWords = await this.getFilteredDictionary(this.difficultWords);
            break;
        }
      }
    }
    document.querySelector('.word-description').innerHTML = '';
    document.querySelector('.word-description').insertAdjacentHTML('afterbegin',
      `<app-word></app-word>`);
    this.drawActiveWord(0);
  }

  addLevelListeners(): void {
    const changeLevel = async (event: MouseEvent) => {
      const target = <HTMLDivElement>event.target;
      const parentDiv = <HTMLDivElement>target.closest('.difficulty-level');
      if (parentDiv && parentDiv.contains(target)) {
        this.currentLevel = parentDiv.id.slice(parentDiv.id.length - 1);
        this.changeLevelView();
        utils.changeColorTheme(this.currentLevel);
        if (this.currentMode === Mode.TEXTBOOK) {
          utils.showLoader();
          await this.initLevelWords();
          utils.checkPageProgress(this.currentMode);
          utils.hideLoader();
        } else {
          utils.showDictionaryLoader();
          document.querySelector('.active-state').classList.remove('active-state');
          document.querySelector('.difficult-words').classList.add('active-state');
          this.getFilteredWords();
          await this.showDifficultWords();
          utils.changeUserWordsCount(this.difficultWords.length, this.learntWords.length, this.newWords.length);
          utils.hideDictionaryLoader();
        }
        utils.updateTranslateView(this.isTranslateShown);
        utils.updateWordButtonsView(this.isWordButtonsShown);
      }
    }

    const levelsContainer = document.querySelector('.difficulty-levels');
    levelsContainer.addEventListener('click', changeLevel); 
  }

  async afterInit() {
    utils.showLoader();
    await this.initLevelWords();
    if (localStorage.getItem('currentPage')) {
      const storageData: IPageState = JSON.parse(localStorage.getItem('currentPage'));
      this.currentMode = storageData.mode;
      this.currentState = storageData.state;
      this.currentLevel = storageData.level;
      this.currentPage = storageData.textbookPage;
      this.currentDictPage = storageData.dictionaryPage;
      this.isTranslateShown = storageData.isTranslateShown;
      this.isWordButtonsShown = storageData.isWordButtonsShown;
      utils.changeSettingsView(this.isTranslateShown, this.isWordButtonsShown);
      if (this.currentMode === Mode.TEXTBOOK) {
        await this.initLevelWords();
        utils.channgePaginationView(this.currentPage);
      } else if (localStorage.getItem('userInfo')) {
        await this.showDictionary();
      }
      if (!localStorage.getItem('userInfo')) this.currentMode = Mode.TEXTBOOK;
      this.changeLevelView();
      utils.changeColorTheme(this.currentLevel);
    }
    utils.checkPageProgress(this.currentMode);
    this.addWordsListeners();
    this.addLevelListeners();
    utils.hideLoader();
    window.addEventListener('beforeunload', this.savePageInLocalStorage.bind(this));
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
