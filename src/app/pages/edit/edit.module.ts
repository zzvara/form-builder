import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EditNameComponent } from '@app/shared/components/edit-name/edit-name.component';
import { SectionComponent } from '@app/shared/components/section/section.component';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { InstanceOfRepeatedSectionPipe } from '@app/shared/pipes/instance-of-repeated-section.pipe';
import { InstanceOfSectionListPipe } from '@app/shared/pipes/instance-of-section-list.pipe';
import { ComponentIconsPipe } from '@app/shared/pipes/used-component-icons.pipe';
import { SharedModule } from '@app/shared/shared.module';
import { TranslatePipe } from '@ngx-translate/core';
import { EditComponent } from '@pages/edit/edit.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

const ngZorro = [
  NzLayoutModule,
  NzIconModule,
  NzFormModule,
  NzCardModule,
  NzButtonModule,
  NzWaveModule,
  NzPopconfirmModule,
  NzSwitchModule,
  NzInputModule,
  NzToolTipModule,
  NzOptionComponent,
  NzSelectComponent,
  NzInputNumberComponent
];

@NgModule({
  declarations: [EditComponent, EditNameComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    DragDropModule,
    SharedModule,
    TranslatePipe,
    FormsModule,
    InstanceOfSectionListPipe,
    InstanceOfFormInputDataPipe,
    InstanceOfRepeatedSectionPipe,
    ComponentIconsPipe,
    ...ngZorro,
  ],
  providers: [SectionComponent, InstanceOfSectionListPipe, InstanceOfFormInputDataPipe, InstanceOfRepeatedSectionPipe],
  exports: [NzIconModule, EditComponent],
})
export class EditModule {}
