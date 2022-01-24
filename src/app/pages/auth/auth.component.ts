import { Component} from '../../../spa';
import Auth from './auth.component.html';
import './auth.component.scss';
import { appHeader } from '../../components/header/app.header';
import { appFooter } from '../../components/footer/app.footer';
import { ComponentEvent } from '../../../spa/core/coreTypes';

const LOGIN = 'login';
const REGISTRATION = 'registration';

class AuthComponent extends Component {
  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.login-link',
    listener: this.goToLoginMode,
  },
  {
    event: 'click',
    className: '.reg-link',
    listener: this.goToRegistrationMode,
  }];

  switchMode(mode: string):void {
    const isLogin = (mode === LOGIN) ? 'block' : 'none';
    const isReg = (mode === REGISTRATION) ? 'block' : 'none';
    const liginBlocks = document.querySelectorAll('.authorization-block');
    liginBlocks.forEach((loginEl: HTMLDivElement) => {
      loginEl.style.display = isLogin;
    });
    const regBlocks = document.querySelectorAll('.registration-block');
    regBlocks.forEach((regEl: HTMLDivElement) => {
      regEl.style.display = isReg;
    });
  }

  goToLoginMode(): void {
    this.switchMode(LOGIN);
  }

  goToRegistrationMode(): void {
    this.switchMode(REGISTRATION);
  }
}

export const authComponent = new AuthComponent({
  selector: 'app-auth',
  components: [
    appHeader,
    appFooter
  ],
  template: Auth,
});
