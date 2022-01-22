import './app.header.scss';
import Header from './app.header.html';

import { Component } from '../../../spa';

class AppHeader extends Component {}

export const appHeader = new AppHeader({
  selector: 'app-header',
  template: Header,
});
