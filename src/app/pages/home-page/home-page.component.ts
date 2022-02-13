import { Component} from '../../../spa';
import HomePage from './home-page.component.html';
import './home-page.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { ComponentEvent } from '../../../spa/core/coreTypes';
import { appAuthForm } from '../../components/auth-form/app.auth-form';

class HomePageComponent extends Component {
  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.more-btn',
    listener: this.readMore,
  }];

  addAnimation() {
    function onEntry(entry: IntersectionObserverEntry[]) {
      entry.forEach(change => {
        if (change.isIntersecting) {
          change.target.classList.add('element-show');
        }
      });
    }
    const options = { threshold: [0.5] };
    const observer: IntersectionObserver = new IntersectionObserver(onEntry, options);
    const elements = document.querySelectorAll('.element-animation');
    elements.forEach((elm) => observer.observe(elm));
  }

  afterInit() {
    const liginBlocks = document.querySelectorAll('.authorization-block');
    liginBlocks.forEach((loginEl: HTMLDivElement) => {
      loginEl.style.display = 'none';
    });
    const regBlocks = document.querySelectorAll('.registration-block');
    regBlocks.forEach((regEl: HTMLDivElement) => {
      regEl.style.display = 'flex';
    });
    const regSection = <HTMLDivElement>document.querySelector('.registration-container');
    if (appHeader.token !== '') {
      regSection.style.display = 'none';
    } else {
      regSection.style.display = 'flex';
    }
    this.addAnimation();
  }

  readMore(): void {
    const navTo = <HTMLDivElement>document.querySelector('.about .block-headers');
    navTo.scrollIntoView();
  }
}

export const homePageComponent = new HomePageComponent({
  selector: 'app-home-page',
  components: [
    appHeader,
    appFooter,
    appAuthForm
  ],
  template: HomePage,
});
