import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';
import { headerResolver } from '@resolvers/header.resolver';
import { TitleStrategy } from '@angular/router';
import { TranslatedTitleStrategy } from './core/title-strategy';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: { menuOptions: headerResolver },
    title: 'TITLE.DASHBOARD',
  },
  {
    path: 'new',
    component: FormCreatorComponent,
    resolve: { menuOptions: headerResolver },
    title: 'TITLE.NEW_FORM',
  },
  {
    path: 'edit',
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: TranslatedTitleStrategy }],
})
export class AppRoutingModule {}
