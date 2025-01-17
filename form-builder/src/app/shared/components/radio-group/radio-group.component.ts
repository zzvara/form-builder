import {Component} from '@angular/core';
import {AbstractInput} from "../../abstract-classes/abstract-input";
import {RadioGroupData} from "./interfaces/radio-group-data";
import {RadioGroupEditComponent} from "./radio-group-edit/radio-group-edit.component";

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.css'
})
export class RadioGroupComponent extends AbstractInput<number, RadioGroupData, RadioGroupEditComponent> {
  override edit(): void {
    this.modalService.openModal({
      modalTitle: 'Edit Radio Group Settings',
      modalContent: RadioGroupEditComponent,
      modalData: this.data
    }).subscribe(this.defaultOnEditSubscribeEvent);
  }
}
