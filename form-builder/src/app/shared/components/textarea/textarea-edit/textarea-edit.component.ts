import { Component } from '@angular/core';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: [],
  standalone: false,
})
export class TextareaEditComponent extends InputEditComponent<TextareaComponentData> {}
