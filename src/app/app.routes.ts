import { IRoute } from '../spa/core/coreTypes';
import { homePageComponent } from './pages/home-page/home-page.component';

export const appRoutes: IRoute[] = [
  { path: '', component: homePageComponent },
];
