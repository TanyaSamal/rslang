import { Component} from '../../../spa';
import HomePage from './home-page.component.html';
import './home-page.component.scss';

class HomePageComponent extends Component {}

export const homePageComponent = new HomePageComponent({
  selector: 'app-home-page',
  components: [
  ],
  template: HomePage,
});
