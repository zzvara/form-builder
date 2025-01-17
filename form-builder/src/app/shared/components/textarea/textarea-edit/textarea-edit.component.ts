import { Component } from '@angular/core';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: ['./textarea-edit.component.css'],
})
export class TextareaEditComponent extends InputEditComponent<TextareaComponentData> {}
