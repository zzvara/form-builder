import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SharedModule } from 'src/app/shared/shared.module';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormEditorComponent } from './form-editor.component';

@NgModule({
  declarations: [FormEditorComponent],
  imports: [
    BrowserModule,
    NzLayoutModule,
    NzIconModule,
    NzFormModule,
    DragDropModule,
    SharedModule,
    NzInputModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,    
  ],
  providers: [],
  exports: [NzIconModule, FormEditorComponent],
})
export class FromEditorModule {}
