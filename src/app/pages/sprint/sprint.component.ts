import { Component} from '../../../spa';
import Sprint from './sprint.component.html';
import './sprint.component.scss';
import { appHeader } from '../../components/header/app.header';

class SprintComponent extends Component {}

export const sprintComponent = new SprintComponent({
  selector: 'app-sprint',
  components: [
    appHeader
  ],
  template: Sprint,
});
