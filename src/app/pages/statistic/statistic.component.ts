import { Component} from '../../../spa';
import Statistic from './statistic.component.html';
import './statistic.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { appLongStatistic } from '../../components/long-statistic/app.long-statistic';

class StatisticComponent extends Component {

  afterInit() {
    if (!localStorage.getItem('userInfo')) {
      document.querySelector('.statistic-page').innerHTML = '';
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
