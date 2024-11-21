import {Component} from '@angular/core';
import {TextareaComponentData} from "../interfaces/textarea-component-data";
import {InputEditComponent} from "../../input/input-edit/input-edit.component";

@Component({
  selector: 'app-textarea-edit',
  templateUrl: './textarea-edit.component.html',
  styleUrls: ['./textarea-edit.component.css']
})
export class TextareaEditComponent extends InputEditComponent<TextareaComponentData> {
}
