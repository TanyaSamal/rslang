import { Component} from '../../../spa';
import NotFound from './not-found.component.html';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';

class NotFoundComponent extends Component {}

export const notFoundComponent = new NotFoundComponent({
  selector: 'app-404',
  components: [
    appHeader,
    appFooter
  ],
  template: NotFound,
});
