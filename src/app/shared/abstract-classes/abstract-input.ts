import type { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import type { OnInit, TemplateRef } from '@angular/core';
import { Directive, EventEmitter, Input, Output, inject } from '@angular/core';
import type { TranslateService } from '@ngx-translate/core';
import type { ModalServiceService } from '@services/modal/modal-service.service';
import type { FormComponentMarker } from '@interfaces/form-component-marker';
import type { InlineEdit } from '@interfaces/inline-edit';
import type { InputData } from '@interfaces/input-data';

@Directive()
export abstract class AbstractInput<T, D extends InputData<T>, E extends AbstractEditForm<T, D>>
  implements FormComponentMarker, OnInit
{
  protected modalService = inject<ModalServiceService<T, D, E>>(ModalServiceService);
  protected translate = inject(TranslateService);

  @Input() label?: TemplateRef<any>;
  @Input() data!: D;
  @Input() inlineEdit: InlineEdit = { enabled: true };

  @Output() edited = new EventEmitter<D>();

  previousValue?: T;

  defaultOnEditSubscribeEvent: (result: boolean | undefined) => void = (result) => {
    if (result) {
      this.onEdit(this.data);
    }
  };

  ngOnInit() {
    this.previousValue = this.data.defaultValue;
  }

  abstract edit(): void;

  onEdit(modifiedData: D) {
    this.edited.emit(modifiedData);
  }

  onChange($event: Event) {
    if (this.previousValue !== this.data.defaultValue) {
      this.onEdit(this.data);
      this.previousValue = this.data.defaultValue;
    }
  }
}
