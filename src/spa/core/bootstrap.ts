import { IModule } from './coreTypes';


export default function bootstrap(module: IModule) {
  module.start();
}
