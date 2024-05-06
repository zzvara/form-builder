import { Component, EventEmitter, Input, Output } from '@angular/core';
import { answerType } from '../../answerType.interface';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  @Input() id!: string;
  @Input() questionValue: string = '';
  @Input() answerValue: answerType = { isRequired: false };
  @Input() inputPlaceholder: string = '';
  @Input() sectiondId!: string;

  @Output() valueChanged = new EventEmitter<{ questionValue: string; answerValue: answerType; id: string }>();

  onQuestionValueChange(newValue: string) {
    this.questionValue = newValue;
    this.emitValueChanged();
  }

  onAnswerValueChange(newValue: string) {
    this.answerValue.answerValue = newValue;
    this.emitValueChanged();
  }

  private emitValueChanged() {
    this.valueChanged.emit({ questionValue: this.questionValue, answerValue: this.answerValue, id: this.id });
    console.log(this.id);
    
  }
}
