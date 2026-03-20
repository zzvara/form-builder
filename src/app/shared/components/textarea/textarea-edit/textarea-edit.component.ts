import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { TranslateModule } from '@ngx-translate/core';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { NzFormControlComponent, NzFormItemComponent, NzFormLabelComponent } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzDividerComponent,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    NzInputNumberModule,
    TranslateModule,
    NzToolTipModule,
    ReactiveFormsModule,
    QuillEditorComponent
  ]
})
export class TextareaEditComponent extends InputEditComponent<TextareaComponentData> {}
