import './app.header.scss';
import Header from './app.header.html';

import { Component, router } from '../../../spa';
import { ComponentEvent } from '../../../spa/core/coreTypes';
import { IGamePoints } from '../../componentTypes';

class AppHeader extends Component {
  isMenuOpen = false;

  isLoggedIn = false;

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

  changeLoginStatus() {
    const loginBtn = <HTMLAnchorElement>document.querySelector('.auth-btn');
    const logoutBtn = <HTMLAnchorElement>document.querySelector('.user-info');
    loginBtn.style.display = (this.isLoggedIn) ? 'none' : 'block';
    logoutBtn.style.display = (this.isLoggedIn) ? 'flex' : 'none';
    const userName = localStorage.getItem('userName');
    if (userName) {
      (<HTMLDivElement>document.querySelector('.user-name')).textContent = userName;
      if (localStorage.getItem('audiocallPoints')) {
        const localResults: IGamePoints = JSON.parse(localStorage.getItem('audiocallPoints'));
        if (localResults.date === new Date().toLocaleDateString() &&
          localResults.userId === JSON.parse(localStorage.getItem('userInfo')).userId) {
          document.querySelector('.game-points').textContent = localResults.points;
        }
      }
    }
  }

  afterInit() {
    if (window.localStorage.getItem('userInfo'))
      this.token = JSON.parse(window.localStorage.getItem('userInfo')).token;
    if (this.token && this.token !== '') {
      this.isLoggedIn = true;
      this.changeLoginStatus();
    }
  }

  toggleMenu(e: Event): void {
    const target = <HTMLDivElement>e.currentTarget;
    if (target.classList.contains('hamburger')) {
      target.classList.toggle('open');
      this.isMenuOpen = !this.isMenuOpen;
      const menu = <HTMLDivElement>document.querySelector('.right-header');
      menu.style.marginLeft = (this.isMenuOpen) ? '0' : '-50%';
    }
  }

  showHomePageLoginForm(): void {
    const regSection = <HTMLDivElement>document.querySelector('.registration-container');
    if (regSection) regSection.style.display = 'flex';
  }

  logout(): void {
    this.isLoggedIn = false;
    this.token = '';
    localStorage.removeItem('userInfo');
    localStorage.removeItem('currentPage');
    router.navigate('#');
    this.changeLoginStatus();
    this.showHomePageLoginForm();
  }

  update(token: string) {
    this.token = token;
  }
}

export const appHeader = new AppHeader({
  selector: 'app-header',
  template: Header,
});

