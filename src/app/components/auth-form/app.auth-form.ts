import './app.auth-form.scss';
import AuthForm from './app.auth-form.html';
import { ComponentEvent } from '../../../spa/core/coreTypes';
import { IAuth } from '../../../spa/tools/controllerTypes';
import { Component, router, Controller } from '../../../spa';

const LOGIN = 'login';
const REGISTRATION = 'registration';
const MIN_PASS_LEN = 8;

class AppAuthForm extends Component {
  private controller = new Controller();

  private isValidEmail = false;

  private isValidPassword = false;

  events = (): ComponentEvent[] =>  [{
    event: 'click',
    className: '.login-link',
    listener: this.goToLoginMode,
  },
  {
    event: 'click',
    className: '.reg-link',
    listener: this.goToRegistrationMode,
  },
  {
    event: 'input',
    className: '#email',
    listener: this.validateEmail,
  },
  {
    event: 'input',
    className: '#pwd',
    listener: this.validatePassword,
  },
  {
    event: 'click',
    className: '.registration-btn',
    listener: this.registration,
  },
  {
    event: 'click',
    className: '.authorization-btn',
    listener: this.login,
  }];

  checkSubmitButtonsStatus(): void {
    const registryBtn = <HTMLButtonElement>document.querySelector('.registration-btn');
    const loginBtn = <HTMLButtonElement>document.querySelector('.authorization-btn');
    if (this.isValidEmail && this.isValidPassword) {
      registryBtn.classList.remove('disabled');
      loginBtn.classList.remove('disabled');
    } else {
      registryBtn.classList.add('disabled');
      loginBtn.classList.add('disabled');
    }
  }

  validateEmail(e: Event): void {
    const email = <HTMLInputElement>e.target;
    if (email.value === '') {
      (<HTMLSpanElement>email.nextElementSibling).style.opacity = '1';
      this.isValidEmail = false;
    } else {
      (<HTMLSpanElement>email.nextElementSibling).style.opacity = '0';
      this.isValidEmail = true;
    }
    this.checkSubmitButtonsStatus();
  }

  validatePassword(e: Event): void {
    const password = <HTMLInputElement>e.target;
    if (password.value.length < MIN_PASS_LEN) {
      (<HTMLSpanElement>password.nextElementSibling).style.opacity = '1';
      this.isValidPassword = false;
    } else {
      (<HTMLSpanElement>password.nextElementSibling).style.opacity = '0';
      this.isValidPassword = true;
    }
    this.checkSubmitButtonsStatus();
  }

  switchMode(mode: string):void {
    const isLogin = (mode === LOGIN) ? 'flex' : 'none';
    const isReg = (mode === REGISTRATION) ? 'flex' : 'none';
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

  showLoginError(msg: string) {
    const errorMessage = <HTMLSpanElement>document.querySelector('.errorMsg');
    errorMessage.textContent = msg;
    errorMessage.style.opacity = '1';
    setTimeout(() => {
      errorMessage.style.opacity = '0';
    }, 5000);
  }

  async setUserName(userId: string, token: string) {
    const userName = await this.controller.getUserName(userId, token);
    if (userName)
      (<HTMLDivElement>document.querySelector('.user-name')).textContent = userName;
  }

  async loginUser(userEmail: string, userPwd: string): Promise<void> {
    const res = await this.controller.loginUser({email: userEmail, password: userPwd});
    if (res.status !== 404 && res.status !== 403) {
      const content: IAuth = await res.json();
      window.localStorage.setItem("userInfo", JSON.stringify(content));
      const { token } = await content;
      this.observable.notify(token);
      if (content) router.navigate('textbook');
      await this.setUserName(content.userId, token);
    } else {
      this.showLoginError('Неправильный e-mail или пароль');
    }
  }

  async registration(): Promise<void> {
    const name = <HTMLInputElement>document.querySelector('#name');
    const email = <HTMLInputElement>document.querySelector('#email');
    const password = <HTMLInputElement>document.querySelector('#pwd');
    const res = await this.controller.createUser({name: name.value, email: email.value, password: password.value});
    if (res.ok) {
      this.loginUser(email.value, password.value);
    } else {
      this.showLoginError('Пользователь с таким e-mail уже существует');
    }
  }

  login(): void {
    const email = <HTMLInputElement>document.querySelector('#email');
    const password = <HTMLInputElement>document.querySelector('#pwd');
    this.loginUser(email.value, password.value);
  }
}

export const appAuthForm = new AppAuthForm({
  selector: 'app-auth-form',
  template: AuthForm,
});
