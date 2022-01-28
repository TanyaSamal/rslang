import { Component } from '../../../spa';
import Auth from './auth.component.html';
import './auth.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { appAuthForm } from '../../components/auth-form/app.auth-form';

class AuthComponent extends Component {}

export const authComponent = new AuthComponent({
  selector: 'app-auth',
  components: [
    appHeader,
    appFooter,
    appAuthForm
  ],
  template: Auth,
});

authComponent.observable.subscribe(appHeader);
