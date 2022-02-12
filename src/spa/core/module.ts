import { IComponent, IModule, IRoute, IModuleConfig } from './coreTypes';
import { router } from '../tools/router';
import { GAME, GAME_AUDIOCALL_OPTIONS, GAME_SPRINT_OPTIONS, SPRINT_STATE } from './coreConsts';
import CONSTS from '../../app/pages/sprint/sprintConsts';

export default class Module implements IModule {
  routes: IRoute[];

  components: IComponent[];

  bootstrapComponent: IComponent;

  constructor(config: IModuleConfig) {
    this.components = config.components;
    this.bootstrapComponent = config.bootstrapComponent;
    this.routes = config.routes;
 }

  static renderComponent(comp: IComponent): void  {
    if (typeof comp.onInit !== 'undefined') comp.onInit();

    comp.render(comp.selector);
    if (typeof comp.beforeInit !== 'undefined') comp.beforeInit();
    if (comp.components) {
      comp.components.forEach((c: IComponent) => {
        if (typeof c.beforeInit !== 'undefined') c.beforeInit();
        c.render(c.selector);
        if (typeof c.afterInit !== 'undefined') c.afterInit();
      });
    }
    if (typeof comp.afterInit !== 'undefined') comp.afterInit();
  }

  private renderRoute(): void  {
    const url = router.getUrl();
    let route = this.routes.find((r) => r.path === url);

    if (typeof route === 'undefined') {
      route = this.routes.find((r) => r.path === '**');
    }

    document.querySelector('router-outlet').innerHTML = `<${route.component.selector}></${route.component.selector}>`;
    Module.renderComponent(route.component);

    if (url === 'sprint') {
      this.initGame(GAME_SPRINT_OPTIONS);
    }

    if (url === 'audiocall') {
      this.initGame(GAME_AUDIOCALL_OPTIONS);
    }

    const timerIdSprintGame: number = localStorage[CONSTS.TIMER_ID_SPRINT];
    const timerIdStartGame: number = localStorage[CONSTS.TIMER_ID_START_GAME];
    clearInterval(timerIdSprintGame);
    clearInterval(timerIdStartGame);
  }

  private initRoutes(): void  {
    window.addEventListener('hashchange', this.renderRoute.bind(this));
    this.renderRoute();
  }

  private initComponents(): void {
    this.bootstrapComponent.render(this.bootstrapComponent.selector);
    this.components.forEach(Module.renderComponent.bind(this));
  }

  start(): void {
    this.initComponents();
    if (this.routes) this.initRoutes();
  }
  
  initGame(optionsGame: GAME): void {
    const name = document.querySelector('.game-name') as HTMLElement;
    const description = document.querySelector('.game-description') as HTMLElement;

    name.innerHTML = optionsGame.name;
    description.innerHTML = optionsGame.description;

    this.checkSourceWords();
  }

  checkSourceWords(): void {
    const dictionary = document.querySelector('.dictionary') as HTMLElement;
    const difficulty = document.querySelector('.difficulty') as HTMLElement;

    if (localStorage[SPRINT_STATE]) {
      dictionary?.classList.remove('hide');
      
      const button = document.querySelector('.start-sprint') as HTMLElement;
      button.removeAttribute('disabled');
      button.classList.add('start-sprint-enable');
    } else {
      difficulty?.classList.remove('hide');
    }
  }
}
