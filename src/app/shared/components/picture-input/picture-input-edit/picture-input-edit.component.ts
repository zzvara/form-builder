import { Component } from '@angular/core';
import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { PictureInputComponentData } from '../interfaces/picture-input-component-data';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { TranslatePipe } from '@ngx-translate/core';
import { QuillEditorComponent } from 'ngx-quill';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-picture-input-edit',
  templateUrl: './picture-input-edit.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    NzFormModule,
    NzDividerComponent,
    NzFormLabelComponent,
    NzFormItemComponent,
    NzFormControlComponent,
    QuillEditorComponent,
    NzInputModule,
    NzCheckboxModule,
    NzButtonModule,
    NzIconModule,
  ],
})
export class PictureInputEditComponent extends AbstractEditForm<
  string | null,
  PictureInputComponentData
> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormValues();
  }
}
