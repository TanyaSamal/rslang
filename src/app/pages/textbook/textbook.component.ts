import { Component} from '../../../spa';
import Textbook from './textbook.component.html';
import './textbook.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { appWord } from '../../components/word/app.word';

class TextbookComponent extends Component {
  afterInit() {
    console.log(`token from textbook - ${appHeader.token}`);
  }
}

export const textbookComponent = new TextbookComponent({
  selector: 'app-textbook',
  components: [
    appHeader,
    appFooter,
    appWord
  ],
  template: Textbook,
});
