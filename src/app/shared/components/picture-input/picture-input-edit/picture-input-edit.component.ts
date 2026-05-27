import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PictureInputComponentData } from '../interfaces/picture-input-component-data';
import { TranslatePipe } from '@ngx-translate/core';
import { QuillEditorComponent } from 'ngx-quill';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import {
  NzFormControlComponent,
  NzFormItemComponent,
  NzFormLabelComponent,
  NzFormModule,
} from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import {CodeEditorModalComponent} from "@components/code-editor/code-editor-modal/code-editor-modal.component";

@Component({
  selector: 'app-picture-input-edit',
  templateUrl: './picture-input-edit.component.html',
  styleUrls: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    CodeEditorModalComponent,
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
