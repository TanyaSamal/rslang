import { IRoute } from '../spa/core/coreTypes';
import { audiocallComponent } from './pages/audiocall/audiocall.component';
import { authComponent } from './pages/auth/auth.component';
import { homePageComponent } from './pages/home-page/home-page.component';
import { notFoundComponent } from './pages/not-found/not-found.component';
import { sprintComponent } from './pages/sprint/sprint.component';
import { statisticComponent } from './pages/statistic/statistic.component';
import { textbookComponent } from './pages/textbook/textbook.component';

export const appRoutes: IRoute[] = [
  { path: '', component: homePageComponent },
  { path: 'auth', component: authComponent },
  { path: 'audiocall', component: audiocallComponent },
  { path: 'sprint', component: sprintComponent },
  { path: 'statistic', component: statisticComponent },
  { path: 'textbook', component: textbookComponent },
  { path: '**', component: notFoundComponent },
];
