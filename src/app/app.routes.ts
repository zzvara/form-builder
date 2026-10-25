import { Routes } from '@angular/router';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';
import { headerResolver } from '@resolvers/header.resolver';
import { RoutePath } from './shared/models/route-path.model';

export const appRoutes: Routes = [
  {
    path: RoutePath.DASHBOARD,
    component: DashboardComponent,
    resolve: { menuOptions: headerResolver },
    title: 'TITLE.DASHBOARD',
  },
  {
    path: RoutePath.NEW,
    component: FormCreatorComponent,
    resolve: { menuOptions: headerResolver },
    title: 'TITLE.NEW_FORM',
  },
  {
    path: RoutePath.EDIT,
    component: FormCreatorComponent,
    resolve: { menuOptions: headerResolver },
    title: 'TITLE.EDIT_FORM',
  },
  {
    path: '**',
    component: DashboardComponent,
    resolve: { menuOptions: headerResolver },
    title: 'TITLE.DASHBOARD',
  },
];
