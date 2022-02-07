import './app.select-difficulty.scss';
import SelectDifficulty from './app.select-difficulty.html';
import { Component } from '../../../spa';

class AppSelectDifficulty extends Component {

}

export const appSelectDifficulty = new AppSelectDifficulty({
    selector: 'app-select-difficulty',
    template: SelectDifficulty,
});
