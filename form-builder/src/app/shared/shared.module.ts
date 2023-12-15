import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

const COMPONENTS = [HeaderComponent, SidebarComponent];

@NgModule({
  declarations: [DatePickerComponent, InputComponent, SelectComponent, TextareaComponent, ...COMPONENTS, ImageUploadComponent],
  imports: [
    BrowserModule,
    CommonModule,
    NzDatePickerModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzLayoutModule,
    NzIconModule,
    NzLayoutModule,
    NzCollapseModule,
    CdkDrag,
  ],
  providers: [],
  exports: [...COMPONENTS],
})
export class SharedModule {}
