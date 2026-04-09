import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { RangePickerComponentData } from '@components/range-picker/interfaces/range-picker-component-data';
import { TranslatePipe } from '@ngx-translate/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-range-picker-edit',
  templateUrl: './range-picker-edit.component.html',
  styleUrls: ['./range-picker-edit.component.less'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzDividerComponent,
    TranslatePipe,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormItemComponent,
    QuillEditorComponent,
    NzDatePickerComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzCheckboxModule,
    DatePipe,
    NzInputModule,
  ],
})
export class RangePickerEditComponent extends DatePickerEditComponent<Date[], RangePickerComponentData> {}
