import {Component} from '@angular/core';
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {CheckboxGroupEditComponent} from "./checkbox-group-edit/checkbox-group-edit.component";
import {CheckboxGroupData, CheckboxOptions} from "./interfaces/checkbox-group-data";

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.css'
})
export class CheckboxGroupComponent extends AbstractInput<CheckboxOptions[], CheckboxGroupData, CheckboxGroupEditComponent> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Radio Group Settings',
      modalContent: CheckboxGroupEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }
}
