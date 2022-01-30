import './app.word.scss';
import { Component } from '../../../spa';
import { IComponentConfig } from '../../../spa/core/coreTypes';

export class AppWord extends Component {

  constructor(config: IComponentConfig) {
    super(config);
    this.wordData = {...config.wordData};
  }
}
