import {Component} from '@angular/core';
import {AbstractEditForm} from "@abstract-classes/abstract-edit-form";
import {PictureInputComponentData} from "../interfaces/picture-input-component-data";

@Component({
    selector: 'app-picture-input-edit',
    templateUrl: './picture-input-edit.component.html',
    styleUrls: ['./picture-input-edit.component.css'],
    standalone: false
})
export class PictureInputEditComponent extends AbstractEditForm<string | null, PictureInputComponentData>{
  override ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormValues();
  }
}
