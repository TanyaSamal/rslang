import { IComponent, IComponentConfig, ComponentEvent } from './coreTypes';

export default class Component implements IComponent {
  template: string;

  selector: string;

  components: [];

  private el: NodeListOf<HTMLElement>;

  events: () => ComponentEvent[];

  constructor(config: IComponentConfig) {
    this.template = config.template;
    this.selector = config.selector;
    this.components = config.components;
    this.el = null;
    this.events = null;
  }

  render(selector: string): void {
    const elSelector = (!selector) ? this.selector : selector;
    this.el = document.querySelectorAll(elSelector);
    if (!this.el) throw new Error(`Component with selector ${this.selector} wasn't found`);
    this.el.forEach((elem: HTMLElement) => {
      // elem.innerHTML = this.compileTemplate(this.template, this.data);
      elem.innerHTML = this.template;
    });
    this.initEvents();
  }

  private initEvents(): void {
    if (this.events !== null) {
      const events = this.events();
      events.forEach((e: ComponentEvent) => {
        this.el.forEach((elem) => {
        elem.querySelectorAll(e.className)
          .forEach((innerElem) => innerElem
            .addEventListener(e.event, e.listener.bind(this)));
        });
      });
    }
  }

  // private compileTemplate(template: string, data: DataType): string {
  //   if (typeof data === 'undefined') return template;

  //   const regex = /\{{.*?}}/g;
  //   return template.replace(regex, (str: string) => {
  //     const key = str.substring(2, str.length - 2).trim();
  //     return data[key];
  //   });
  // }
}
