import {Component} from '@angular/core';
import {AbstractFieldLikeEditForm} from "../../../abstract-classes/abstract-fieldlike-edit-form";
import {UpdateOnStrategy} from "../../../interfaces/update-on-strategy";
import {NumberInputComponentData} from "../interfaces/number-input-component-data";

@Component({
  selector: 'app-number-input-edit',
  templateUrl: './number-input-edit.component.html',
  styleUrls: ['./number-input-edit.component.css']
})
export class NumberInputEditComponent extends AbstractFieldLikeEditForm<NumberInputComponentData> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.initializeFormValues();
  }
}
