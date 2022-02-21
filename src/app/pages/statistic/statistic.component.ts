import { Component, Controller} from '../../../spa';
import Statistic from './statistic.component.html';
import './statistic.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { appLongStatistic } from '../../components/long-statistic/app.long-statistic';
import { IGameStatistic } from '../../componentTypes';
import { IAuth, WordStatus } from '../../../spa/tools/controllerTypes';

class StatisticComponent extends Component {
  private controller = new Controller();

  async drawWordsStatistic() {
    const newWordsEl = <HTMLParagraphElement>document.querySelector('.new-words p:first-child');
    const learnedWordsEl = <HTMLParagraphElement>document.querySelector('.learned-words p:first-child');
    const percentWordsEl = <HTMLParagraphElement>document.querySelector('.percent-words p:first-child');
    const audiocallStatistic: IGameStatistic = JSON.parse(localStorage.getItem('audiocallStatistic'));
    const sprintStatistic: IGameStatistic = JSON.parse(localStorage.getItem('sprintStatistic'));

    if (audiocallStatistic && sprintStatistic 
      && audiocallStatistic.date === new Date().toLocaleDateString()
      && sprintStatistic.date === new Date().toLocaleDateString()) {
      percentWordsEl.textContent = `${Math.round((audiocallStatistic.rightAnswers + sprintStatistic.rightAnswers) /
      (audiocallStatistic.totalAnswers + sprintStatistic.totalAnswers) * 100)}%`;
      newWordsEl.textContent = `${audiocallStatistic.newWords + sprintStatistic.newWords}`
    } else if ((audiocallStatistic && audiocallStatistic.date === new Date().toLocaleDateString())
      || (sprintStatistic && sprintStatistic.date === new Date().toLocaleDateString())){
      percentWordsEl.textContent = (audiocallStatistic) ?
        `${(document.querySelectorAll('.games-statistic .right-answers'))[0].textContent}%` :
        `${(document.querySelectorAll('.games-statistic .right-answers'))[1].textContent}%`;
      newWordsEl.textContent =  `${(audiocallStatistic) ? audiocallStatistic.newWords : sprintStatistic.newWords}`;
    }

    const userInfo: IAuth = JSON.parse(localStorage.getItem('userInfo'));
    const userWords = await this.controller.getUserWords(userInfo.userId, userInfo.token);
    const learnedWords = userWords.filter((word) => word.optional.status === WordStatus.learnt
      && word.optional.updatedDate === new Date().toLocaleDateString());
    learnedWordsEl.textContent = `${learnedWords.length}`;
  }

  drawGamesStatistic() {
    const audiocallStatistic: IGameStatistic = JSON.parse(localStorage.getItem('audiocallStatistic'));
    const sprintStatistic: IGameStatistic = JSON.parse(localStorage.getItem('sprintStatistic'));
    const learntEl = document.querySelectorAll('.games-statistic .learnt-words');
    const rightEl = document.querySelectorAll('.games-statistic .right-answers');
    const seriesEl = document.querySelectorAll('.games-statistic .long-series');

    if (audiocallStatistic && audiocallStatistic.date === new Date().toLocaleDateString()) {
      learntEl[0].textContent = `${audiocallStatistic.newWords}`;
      if (audiocallStatistic.totalAnswers !== 0)
        rightEl[0].textContent = `${Math.round(audiocallStatistic.rightAnswers / audiocallStatistic.totalAnswers * 100)}`;
      seriesEl[0].textContent = `${audiocallStatistic.longest}`;
    }

    if (sprintStatistic && sprintStatistic.date === new Date().toLocaleDateString()) {
      learntEl[1].textContent = `${sprintStatistic.newWords}`;
      if (sprintStatistic.totalAnswers !== 0)
        rightEl[1].textContent = `${Math.round(sprintStatistic.rightAnswers/ sprintStatistic.totalAnswers * 100)}`;
      seriesEl[1].textContent = `${sprintStatistic.longest}`;
    }
  }

  afterInit() {
    if (!localStorage.getItem('userInfo')) {
      document.querySelector('.statistic-page').innerHTML = 'Статистика доступна только авторизованным пользователям';
    } else {
      this.drawGamesStatistic();
      this.drawWordsStatistic();
    }
  }
}

export const statisticComponent = new StatisticComponent({
  selector: 'app-statistic',
  components: [
    appHeader,
    appFooter,
    appLongStatistic
  ],
  template: Statistic,
});
