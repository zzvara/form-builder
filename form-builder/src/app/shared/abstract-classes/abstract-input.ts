import {Directive, EventEmitter, inject, Input, Output} from "@angular/core";
import {ModalServiceService} from "../../services/modal/modal-service.service";
import {FormComponentMarker} from "../interfaces/form-component-marker";
import {InlineEdit} from "../interfaces/inline-edit";
import {InputData} from "../interfaces/input-data";
import {AbstractEditForm} from "./abstract-edit-form";

@Directive()
export abstract class AbstractInput<D extends InputData<T>, E extends AbstractEditForm<D, T>, T> implements FormComponentMarker {
  protected readonly modalService: ModalServiceService<E, D> = inject(ModalServiceService);

  @Input() data!: D;
  @Input() inlineEdit: InlineEdit = { enabled: true };

  @Output() edited = new EventEmitter<D>();

  abstract edit(): void;

  onEdit(modifiedData: D) {
    this.edited.emit(modifiedData);
  }

  onChange($event: any) {
    this.onEdit(this.data);
  }
}
