import './app.game-statistic.scss';
import GameStatistic from './app.game-statistic.html';

import { Component } from '../../../spa';

class AppGameStatistic extends Component {}

export const appGameStatistic = new AppGameStatistic({
  selector: 'app-game-statistic',
  template: GameStatistic,
});
