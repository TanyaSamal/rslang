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

export interface ICallQuestion {
  answerWord: string,
  answerTranslate: string,
  image: string,
  answer1: string,
  answer2: string,
  answer3: string,
  answer4: string,
  answer5: string,
  [key: string]: string
}

type WordInfo = IWord | ICallQuestion;

export interface IComponentConfig {
  template: string,
  selector: string,
  components?: IComponent[],
  wordData?: WordInfo
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
