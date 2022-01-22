import { Component} from '../../../spa';
import HomePage from './home-page.component.html';
import './home-page.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { ComponentEvent } from '../../../spa/core/coreTypes';

class HomePageComponent extends Component {
  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.more-btn',
    listener: this.readMore,
  }];

  readMore(): void {
    const navTo = <HTMLDivElement>document.querySelector('.about .block-headers');
    navTo.scrollIntoView();
  }
}

export const homePageComponent = new HomePageComponent({
  selector: 'app-home-page',
  components: [
    appHeader,
    appFooter
  ],
  template: HomePage,
});
