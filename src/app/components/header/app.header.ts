import './app.header.scss';
import Header from './app.header.html';

import { Component } from '../../../spa';
import { ComponentEvent } from '../../../spa/core/coreTypes';

class AppHeader extends Component {
  isMenuOpen = false;

  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.hamburger',
    listener: this.toggleMenu,
  }];

  toggleMenu(e: Event): void {
    const target = <HTMLDivElement>e.currentTarget;
    if (target.classList.contains('hamburger')) {
      target.classList.toggle('open');
      this.isMenuOpen = !this.isMenuOpen;
      const menu = <HTMLDivElement>document.querySelector('.right-header');
      menu.style.marginLeft = (this.isMenuOpen) ? '0' : '-50%';
    }
  }
}

export const appHeader = new AppHeader({
  selector: 'app-header',
  template: Header,
});
