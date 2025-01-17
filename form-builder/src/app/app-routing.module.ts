import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';
import { headerResolver } from '@resolvers/header.resolver';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    resolve: { menuOptions: headerResolver },
  },
  {
    path: 'new',
    component: FormCreatorComponent,
    resolve: { menuOptions: headerResolver },
  },
  {
    path: 'edit',
    component: FormCreatorComponent,
    resolve: { menuOptions: headerResolver },
  },
  {
    path: '**',
    component: DashboardComponent,
    resolve: { menuOptions: headerResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
