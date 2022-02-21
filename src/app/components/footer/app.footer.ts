import './app.footer.scss';
import Footer from './app.footer.html';

import { Component } from '../../../spa';

class AppFooter extends Component {}

export const appFooter = new AppFooter({
  selector: 'app-footer',
  template: Footer,
});
