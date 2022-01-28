import './app.word.scss';
import Word from './app.word.html';

import { Component } from '../../../spa';

class AppWord extends Component {}

export const appWord = new AppWord({
  selector: 'app-word',
  template: Word,
});
