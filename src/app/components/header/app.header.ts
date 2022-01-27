import './app.header.scss';
import Header from './app.header.html';

import { Component } from '../../../spa';
import { ComponentEvent } from '../../../spa/core/coreTypes';

class AppHeader extends Component {
  isMenuOpen = false;

  isLoggedIn = false;

  changeLoginStatus() {
    const loginBtn = <HTMLAnchorElement>document.querySelector('.auth-btn');
    const logoutBtn = <HTMLAnchorElement>document.querySelector('.logout-btn');
    loginBtn.style.display = (this.isLoggedIn) ? 'none' : 'block';
    logoutBtn.style.display = (this.isLoggedIn) ? 'block' : 'none';
  }

  afterInit() {
    console.log(`token from header - ${this.token}`);
    if (this.token && this.token !== '') {
      this.isLoggedIn = true;
      this.changeLoginStatus();
    }
  }

  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.hamburger',
    listener: this.toggleMenu,
  },
  {
    event: 'click',
    className: '.logout-btn',
    listener: this.logout,
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

  logout(): void {
    this.isLoggedIn = false;
    this.token = '';
    this.changeLoginStatus();
  }

  update(token: string) {
    this.token = token;
  }
}

export const appHeader = new AppHeader({
  selector: 'app-header',
  template: Header,
});
