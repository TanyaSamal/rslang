import { Module } from '../spa';
import { appRoutes } from './app.routes';

import { appComponent } from './app.component';

class AppModule extends Module {}

export const appModule = new AppModule({
  components: [],
  bootstrapComponent: appComponent,
  routes: appRoutes,
});
