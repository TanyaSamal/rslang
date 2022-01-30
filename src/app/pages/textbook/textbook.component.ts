import { Component, Controller } from '../../../spa';
import Textbook from './textbook.component.html';
import './textbook.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { AppWord } from '../../components/word/app.word';
import Word from '../../components/word/app.word.html';
import { IWord } from '../../../spa/tools/controllerTypes';

const BASE_URL = 'https://rslang-2022.herokuapp.com/';
// const COLORS = ['#8bd884', '#71DEC5', '#fff174', '#ffcb74', '#FE8366', '#d34747'];

class TextbookComponent extends Component {
  private controller = new Controller();

  private currentPage = '0';

  private currentLevel = '0';

  private pageWords : IWord[];

  drawActiveWord(idx: number, level: number): void {
    document.querySelector('.word-description').innerHTML = '';
    document.querySelector('.word-description').insertAdjacentHTML('afterbegin',
      `<app-word></app-word>`);

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

    const wordLink = <HTMLDivElement>document.querySelector(`#word${idx}`);
    wordLink.classList.add('active-card');
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
    this.pageWords = await this.controller.getWords(this.currentPage, this.currentLevel);
    this.pageWords.sort((wordItem1, wordItem2) => {
      if (wordItem1.word > wordItem2.word) return 1;
      if (wordItem1.word < wordItem2.word) return -1;
      return 0;
    });
    this.drawWords();
    this.drawActiveWord(0, Number(this.currentLevel));
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
