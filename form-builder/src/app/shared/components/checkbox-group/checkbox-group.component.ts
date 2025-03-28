import { AbstractInput } from '@abstract-classes/abstract-input';
import { Component } from '@angular/core';
import { CheckboxGroupEditComponent } from '@components/checkbox-group/checkbox-group-edit/checkbox-group-edit.component';
import { CheckboxGroupData, CheckboxOptions } from '@components/checkbox-group/interfaces/checkbox-group-data';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.less',
  standalone: false,
})
export class CheckboxGroupComponent extends AbstractInput<CheckboxOptions[], CheckboxGroupData, CheckboxGroupEditComponent> {
  override edit(): void {
    // @todo modalTitle should be translated
    this.modalService
      .openModal({
        modalTitle: 'Edit Radio Group Settings',
        modalContent: CheckboxGroupEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
