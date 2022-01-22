import { Component} from '../../../spa';
import Audiocall from './audiocall.component.html';
import './audiocall.component.scss';
import { appHeader } from '../../components/header/app.header';

class AudiocallComponent extends Component {}

export const audiocallComponent = new AudiocallComponent({
  selector: 'app-audiocall',
  components: [
    appHeader
  ],
  template: Audiocall,
});
