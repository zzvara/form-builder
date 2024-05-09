import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
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
import { SectionComponent } from './components/section/section.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RedoUndoComponent } from './components/redo-undo/redo-undo.component';
import { PictureInputComponent } from './components/picture-input/picture-input.component';
import { InputLayoutComponent } from './components/input-layout/input-layout.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';

const COMPONENTS = [
  DatePickerComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
  HeaderComponent,
  SidebarComponent,
  ImageUploadComponent,
  PictureInputComponent,
  RedoUndoComponent,
  SectionComponent,
  NumberInputComponent
];

@NgModule({
  declarations: [
    DatePickerComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    ...COMPONENTS,
    ImageUploadComponent,
    InputLayoutComponent
  ],
  imports: [
    NzInputNumberModule,
    NzUploadModule,
    NzCardModule,
    BrowserModule,
    CommonModule,
    NzDatePickerModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzLayoutModule,
    NzIconModule,
    NzCollapseModule,
    CdkDrag,
    CdkDropList,
    DragDropModule,
    NzIconModule,
    NzButtonModule,
  ],
  providers: [],
  exports: [...COMPONENTS],
})
export class SharedModule {}
