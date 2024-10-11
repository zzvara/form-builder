//Imports from packages
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CdkDrag, CdkDropList, DragDropModule } from '@angular/cdk/drag-drop';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
//Components
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SectionComponent } from './components/section/section.component';
import { RedoUndoComponent } from './components/redo-undo/redo-undo.component';
import { PictureInputComponent } from './components/picture-input/picture-input.component';
import { InputLayoutComponent } from './components/input-layout/input-layout.component';
import { NumberInputComponent } from './components/number-input/number-input.component';
import {SelectModalComponent} from "./components/select/select-modal/select-modal.component";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzListModule} from "ng-zorro-antd/list";

const COMPONENTS = [
  DatePickerComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
  HeaderComponent,
  SidebarComponent,
  SectionComponent,
  RedoUndoComponent,
  PictureInputComponent,
  NumberInputComponent,
  InputLayoutComponent,
  SelectModalComponent,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
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
    NzButtonModule,
    NzModalModule,
    NzCheckboxModule,
    NzListModule,
  ],
  providers: [],
  exports: [...COMPONENTS],
})
export class SharedModule {}
