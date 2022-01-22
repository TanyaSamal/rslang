import { Component} from '../../../spa';
import Statistic from './statistic.component.html';
import './statistic.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';

class StatisticComponent extends Component {}

export const statisticComponent = new StatisticComponent({
  selector: 'app-statistic',
  components: [
    appHeader,
    appFooter
  ],
  template: Statistic,
});
