import { IComponent } from "../core/coreTypes";

export default class Observable {

  private subscribers: IComponent[];

  constructor() {
    this.subscribers = [];
  }

  subscribe(observer: IComponent) {
    this.subscribers.push(observer);
  }

  unsubscribe(observer: IComponent) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== observer);
  }

  notify(token: string) {
    this.subscribers.forEach(subscriber => subscriber.update(token));
  }
}
