import { AbstractInput } from '@abstract-classes/abstract-input';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RadioGroupData } from '@components/radio-group/interfaces/radio-group-data';
import { RadioGroupEditComponent } from '@components/radio-group/radio-group-edit/radio-group-edit.component';
import { NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzRadioGroupComponent, NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  selector: 'app-radio-group',
  templateUrl: './radio-group.component.html',
  styleUrl: './radio-group.component.less',
  standalone: true,
  imports: [CommonModule, FormsModule, NzFormItemComponent, NzRadioGroupComponent, NzRadioModule],
})
export class RadioGroupComponent extends AbstractInput<
  number,
  RadioGroupData,
  RadioGroupEditComponent
> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.RADIO_GROUP.MODAL_RADIO_GROUP_TITLE'),
        modalContent: RadioGroupEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
