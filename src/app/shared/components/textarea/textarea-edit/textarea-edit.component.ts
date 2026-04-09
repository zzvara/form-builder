import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { TranslatePipe } from '@ngx-translate/core';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: ['./textarea-edit.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzDividerComponent,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputNumberModule,
    NzTooltipModule,
    ReactiveFormsModule,
    QuillEditorComponent,
    NzInputModule,
    NzCheckboxModule,
    TranslatePipe,
  ],
})
export class TextareaEditComponent extends InputEditComponent<TextareaComponentData> {}
