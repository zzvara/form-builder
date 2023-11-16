import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { TextareaComponent } from './components/textarea/textarea.component';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RedoUndoComponent } from './components/redo-undo/redo-undo.component';

@NgModule({
  declarations: [
    DatePickerComponent,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    RedoUndoComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NzDatePickerModule,
    NzInputModule,
    NzSelectModule,
    FormsModule,
    NzIconModule,
    NzButtonModule,
  ],
  providers: [],
  exports: [],
})
export class SharedModule {}
