import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  @Input() id!: string;
  @Input() questionValue: string = 'Date input';
  @Input() descriptionValue: string = 'The input can be used for...';
  @Input() answerValue: any = new Date();
  inputPlaceholder: string = 'Date input value';
  inputTemplate!: TemplateRef<any>;
  @Input() type: string = 'text';
  @Input() sectionId!: string;

  @Output() valueChanged = new EventEmitter<{ questionValue: string; answerValue: string; descriptionValue: string; id: string }>();
  @Output() removeComponentEvent = new EventEmitter<string>();

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
