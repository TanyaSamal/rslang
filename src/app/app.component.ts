import { Component } from '../spa';

class AppComponent extends Component {}

export const appComponent = new AppComponent({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `,
});
