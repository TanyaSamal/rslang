import './app.word.scss';
import { Component, Controller } from '../../../spa';
import { ComponentEvent, IComponentConfig } from '../../../spa/core/coreTypes';
import { IAuth, IStatistics, IUserWord, WordStatus, IStatOptions } from '../../../spa/tools/controllerTypes';
import * as utils from '../../pages/textbook/utils';

export class AppWord extends Component {
  private controller = new Controller();

  constructor(config: IComponentConfig) {
    super(config);
    this.wordData = {...config.wordData};
  }

  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.add-in-difficult',
    listener: this.addInDifficult,
  },{
    event: 'click',
    className: '.add-in-lernt',
    listener: this.addInLearnt,
  }];

  setWordProgress(status: WordStatus): IUserWord {
    const audiocallRight = <HTMLSpanElement>document.querySelector('.audiocall-right');
    const audiocallWrong = <HTMLSpanElement>document.querySelector('.audiocall-wrong');
    const sprintRight = <HTMLSpanElement>document.querySelector('.spring-right');
    const sprintWrong = <HTMLSpanElement>document.querySelector('.sprint-wrong');
    const difficultLevel = document.querySelector('.active-level');
    const wordProgress: IUserWord = {
      difficulty: difficultLevel.id.slice(-1),
      optional: {
        updatedDate: new Date().toLocaleDateString(),
        status,
        gameProgress: {
          sprint: {
            right: +sprintRight.textContent,
            wrong: +sprintWrong.textContent,
          },
          audiocall: {
            right: +audiocallRight.textContent,
            wrong: +audiocallWrong.textContent,
          },
        }
      }
    };
    return wordProgress;
  }

  changeWordStatus(status: string): void {
    const activWord = window.localStorage.getItem('activeWord');
    if (activWord) {
      const activBlock = <HTMLDivElement>document.querySelector(`#textbook${activWord} .word-status`);
      activBlock.style.display = 'block';
      activBlock.lastElementChild.textContent = status;
    }
  }

  async sendStatistic(userId: string, token: string) {
    let currentStatistic: IStatistics = await this.controller.getStatistics(userId, token);
    const today = new Date().toLocaleDateString();
    const statistic: IStatOptions = {
      date: today,
      newWords: 1,
      totalWords: 1
    }
    if (currentStatistic) {
      delete currentStatistic.id;
      const currentStat: IStatOptions[] = JSON.parse(currentStatistic.optional.stat);
      if (currentStat[currentStat.length - 1].date === today) {
        currentStatistic.learnedWords += 1;
        currentStat[currentStat.length - 1].newWords += 1;
        currentStat[currentStat.length - 1].totalWords += 1;
      } else {
        let learnt = 0;
        currentStat.forEach(el => {
          learnt += el.totalWords
        });
        statistic.totalWords = learnt + 1;
        currentStatistic.learnedWords = learnt + 1;
        currentStat.push(statistic);
      }
      currentStatistic.optional.stat = JSON.stringify(currentStat);
    } else {
      currentStatistic = {
        learnedWords: 1,
        optional: {
          stat: JSON.stringify([statistic])
        }
      }
    }
    await this.controller.setStatistics(userId, token, currentStatistic);
  }

  async addInDifficult() {
    this.changeWordStatus('C');
    utils.checkPageProgress();
    const wordProgress: IUserWord = this.setWordProgress(WordStatus.difficult);
    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    const wordID: string = JSON.parse(localStorage.getItem('activeWordID'));
    await this.controller.createUserWord(userInfo.userId, wordID, wordProgress, userInfo.token);
  }

  async addInLearnt() {
    this.changeWordStatus('И');
    utils.checkPageProgress();
    const wordProgress: IUserWord = this.setWordProgress(WordStatus.learnt);
    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    const wordID: string = JSON.parse(localStorage.getItem('activeWordID'));
    await this.controller.createUserWord(userInfo.userId, wordID, wordProgress, userInfo.token);
    await this.sendStatistic(userInfo.userId, userInfo.token);
  }

  afterInit() {
    if (window.localStorage.getItem('userInfo')) {
      const hiddenElements = document.querySelectorAll('.only-authorized');
      hiddenElements.forEach((el: HTMLDivElement) => el.classList.remove('only-authorized'));
    }
  }

}
