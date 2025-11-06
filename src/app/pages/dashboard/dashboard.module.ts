import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { CardViewComponent } from '@pages/dashboard/card-view/card-view.component';
import { ListViewComponent } from '@pages/dashboard/list-view/list-view.component';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';


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
    NzToolTipModule,
    NzPopconfirmModule,
    TranslatePipe,
    SafeHtmlPipe,
  ],
  providers: [NzModalService],
  exports: [NzLayoutModule],
})
export class DashboardModule {}
