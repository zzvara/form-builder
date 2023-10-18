import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DashboardComponent } from './dashboard.component';
import { ListViewComponent } from './list-view/list-view.component';
import { CardViewComponent } from './card-view/card-view.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';

@NgModule({
  declarations: [DashboardComponent, CardViewComponent, ListViewComponent],
  imports: [
    BrowserModule,
    NzTableModule,
    NzIconModule,
    NzLayoutModule,
    NzGridModule,
    NzButtonModule,
    NzCardModule,
  ],
  providers: [],
  exports: [NzLayoutModule],
})
export class DashboardModule {}
