import { Component} from '../../../spa';
import Textbook from './textbook.component.html';
import './textbook.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';

class TextbookComponent extends Component {}

export const textbookComponent = new TextbookComponent({
  selector: 'app-textbook',
  components: [
    appHeader,
    appFooter
  ],
  template: Textbook,
});
