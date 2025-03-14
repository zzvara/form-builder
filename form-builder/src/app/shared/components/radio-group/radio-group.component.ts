import {AbstractInput} from '@abstract-classes/abstract-input';
import {Component} from '@angular/core';
import {RadioGroupData} from '@components/radio-group/interfaces/radio-group-data';
import {RadioGroupEditComponent} from '@components/radio-group/radio-group-edit/radio-group-edit.component';

@Component({
    selector: 'app-radio-group',
    templateUrl: './radio-group.component.html',
    styleUrl: './radio-group.component.css',
    standalone: false
})
export class RadioGroupComponent extends AbstractInput<number, RadioGroupData, RadioGroupEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: 'Edit Radio Group Settings',
        modalContent: RadioGroupEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
