//Imports from packages
import {CdkDrag, CdkDropList, DragDropModule} from '@angular/cdk/drag-drop';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzUploadModule} from 'ng-zorro-antd/upload';
//Components
import {DatePickerComponent} from './components/date-picker/date-picker.component';
import {HeaderComponent} from './components/header/header.component';
import {InputLayoutComponent} from './components/input-layout/input-layout.component';
import {InputComponent} from './components/input/input.component';
import {NumberInputComponent} from './components/number-input/number-input.component';
import {PictureInputComponent} from './components/picture-input/picture-input.component';
import {RedoUndoComponent} from './components/redo-undo/redo-undo.component';
import {SectionComponent} from './components/section/section.component';
import {SelectComponent} from './components/select/select.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TextareaComponent} from './components/textarea/textarea.component';

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
  ],
  providers: [],
  exports: [...COMPONENTS],
})
export class SharedModule {}
