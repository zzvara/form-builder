import { AbstractFieldLikeInputs } from '@abstract-classes/abstract-fieldlike-inputs';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectComponentData } from '@components/select/interfaces/select-component-data';
import { SelectEditComponent } from '@components/select/select-edit/select-edit.component';
import { NzFormControlComponent, NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzFormItemComponent,
    NzFormControlComponent,
    NzSelectComponent,
    NzOptionComponent,
    NzTooltipModule,
    NzIconModule,
  ],
})
export class SelectComponent extends AbstractFieldLikeInputs<
  string | string[],
  SelectComponentData,
  SelectEditComponent
> {
  override edit(): void {
    this.modalService
      .openModal({
        modalTitle: this.translate.instant('COMPONENTS.COMBOBOX.MODEL_TITLE_SELECT'),
        modalContent: SelectEditComponent,
        modalData: this.data,
      })
      .subscribe(this.defaultOnEditSubscribeEvent);
  }
}
