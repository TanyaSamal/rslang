import { IWord } from "../tools/controllerTypes";

export interface IModule {
  start: () => void
}

export type ComponentEvent = {
  event: string,
  className: string,
  listener: (e: Event) => void
}

export interface IComponent {
  template: string,
  selector: string,
  components: IComponent[],
  events?: () => ComponentEvent[],
  render: (selector: string) => void,
  afterInit?: () => void,
  beforeInit?: () => void,
  onInit?: () => void,
  update?: (token: string) => void
}

export interface IComponentConfig {
  template: string,
  selector: string,
  components?: IComponent[],
  wordData?: IWord
}

export interface IRoute {
  path: string,
  component: IComponent
}

export interface IModuleConfig {
  components: IComponent[],
  bootstrapComponent: IComponent,
  routes: IRoute[]
}
