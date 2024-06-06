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
  @Input() answerValue: any = 'Date answer';
  inputPlaceholder: string = 'Date input value';
  inputTemplate!: TemplateRef<any>;
  @Input() type: string = 'text';
  @Input() sectiondId!: string;

  @Output() valueChanged = new EventEmitter<{ questionValue: string; answerValue: string;descriptionValue: string; id: string }>();

  onQuestionValueChange(newValue: string) {
    this.questionValue = newValue;
    this.emitValueChanged();
  }

  onAnswerValueChange(newValue: string) {
    this.answerValue = newValue;
    this.emitValueChanged();
  }

  onDescriptionValueChange(newValue: string) {
    this.descriptionValue = newValue;
    this.emitValueChanged();
  }

  private emitValueChanged() {
    this.valueChanged.emit({ questionValue: this.questionValue, answerValue: this.answerValue, descriptionValue: this.descriptionValue, id: this.id });
  }
}
