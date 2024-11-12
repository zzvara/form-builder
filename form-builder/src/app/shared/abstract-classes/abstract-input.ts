import {Directive, EventEmitter, Input, Output} from "@angular/core";
import {InputData} from "../interfaces/input-data";
import {FormComponentMarker} from "../interfaces/form-component-marker";
import {InlineEdit} from "../interfaces/inline-edit";

@Directive()
export abstract class AbstractInput<D extends InputData<T>, T> implements FormComponentMarker {
  @Input() data!: D;
  @Input() inlineEdit: InlineEdit = { enabled: true };

  @Output() edited = new EventEmitter<D>();

  abstract edit(): void;

  defaultValueSetter(modifiedData: D | undefined) {
    if (modifiedData) {
      this.data.questionValue    = modifiedData.questionValue;
      this.data.descriptionValue = modifiedData.descriptionValue;
      this.data.defaultValue     = modifiedData.defaultValue;
      this.data.placeholderValue = modifiedData.placeholderValue;
      this.onEdit(modifiedData);
    }
  }

  onEdit(modifiedData: D) {
    this.edited.emit(modifiedData);
  }

  onChange($event: any) {
    this.onEdit(this.data)
  }
}
