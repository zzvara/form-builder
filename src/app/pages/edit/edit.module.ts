import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SectionComponent } from '@app/shared/components/section/section.component';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { InstanceOfSectionListPipe } from '@app/shared/pipes/instance-of-section-list.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { TranslatePipe } from '@ngx-translate/core';
import { EditComponent } from '@pages/edit/edit.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@NgModule({
  declarations: [EditComponent],
  imports: [
    BrowserModule,
    NzLayoutModule,
    NzIconModule,
    NzFormModule,
    DragDropModule,
    SharedModule,
    NzCardModule,
    NzButtonModule,
    NzWaveModule,
    NzPopconfirmModule,
    TranslatePipe,
    NzSwitchModule,
    FormsModule,
    InstanceOfSectionListPipe,
    InstanceOfFormInputDataPipe,
  ],
  providers: [SectionComponent, InstanceOfSectionListPipe, InstanceOfFormInputDataPipe],
  exports: [NzIconModule, EditComponent],
})
export class EditModule {}
