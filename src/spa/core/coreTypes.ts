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
  onInit?: () => void
}

export interface IComponentConfig {
  template: string,
  selector: string,
  components?: IComponent[]
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
