import { AbstractEditForm } from '@abstract-classes/abstract-edit-form';
import { Directive, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { FormComponentMarker } from '@interfaces/form-component-marker';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';

@Directive()
export abstract class AbstractInput<T, D extends InputData<T>, E extends AbstractEditForm<T, D>> implements FormComponentMarker, OnInit {
  protected readonly modalService: ModalServiceService<T, D, E> = inject(ModalServiceService);

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

  onChange($event: any) {
    if (this.previousValue !== this.data.defaultValue) {
      this.onEdit(this.data);
      this.previousValue = this.data.defaultValue;
    }
  }
}
