import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import {AbstractInput} from "../../abstract-classes/abstract-input";

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent extends AbstractInput {
  inputPlaceholder: string = 'Date input value';
  inputTemplate!: TemplateRef<any>;

  @Output() valueChanged = new EventEmitter<{ questionValue: string; answerValue: string; descriptionValue: string; id: string }>();

  onQuestionValueChange(newValue: string) {
    this.questionValue = newValue;
    this.emitValueChanged();
  }

  onAnswerValueChange(newValue: string) {
    let validDate = new Date(newValue);
    if (!this.isValidDate(validDate)) {
      validDate = new Date();
    }
    this.answerValue = validDate;
    this.emitValueChanged();
  }

  onDescriptionValueChange(newValue: string) {
    this.descriptionValue = newValue;
    this.emitValueChanged();
  }

  private emitValueChanged() {
    if (!this.isValidDate(this.answerValue)) {
      this.answerValue = new Date();
    }

    this.valueChanged.emit({
      questionValue: this.questionValue,
      answerValue: this.answerValue.toISOString(),
      descriptionValue: this.descriptionValue,
      id: this.id,
    });
  }

  isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
  }
}
