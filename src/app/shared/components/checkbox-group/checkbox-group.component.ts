import { AbstractInput } from '@abstract-classes/abstract-input';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxGroupEditComponent } from '@components/checkbox-group/checkbox-group-edit/checkbox-group-edit.component';
import { CheckboxGroupData, CheckboxOptions } from '@components/checkbox-group/interfaces/checkbox-group-data';
import { NzCheckboxGroupComponent, NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormItemComponent } from 'ng-zorro-antd/form';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.less',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormItemComponent,
    NzCheckboxGroupComponent,
    NzCheckboxModule,
  ],
})
export class CheckboxGroupComponent extends AbstractInput<CheckboxOptions[], CheckboxGroupData, CheckboxGroupEditComponent> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.CHECKBOX_GROUP.MODAL_CHECKBOX_GROUP_TITLE'),
        modalContent: CheckboxGroupEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
