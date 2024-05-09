import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { answerType } from '../../answerType.interface';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.css'],
})
export class DatePickerComponent {
  questionValue: string = 'Date input';
  descriptionValue: string = 'The input can be used for...';
  answerValue: any = 'Date answer';
  inputPlaceholder: string = 'Date input value';
  inputTemplate!: TemplateRef<any>;
  type: string = 'text';
  @Input() sectiondId!: string;

  //@Output() valueChanged = new EventEmitter<{ questionValue: string; answerValue: answerType; id: string }>();

  onQuestionValueChange(newValue: string) {
    this.questionValue = newValue;
    this.emitValueChanged();
  }

  onAnswerValueChange(newValue: string) {
    this.answerValue.answerValue = newValue;
    this.emitValueChanged();
  }

  private emitValueChanged() {
    // this.valueChanged.emit({ questionValue: this.questionValue, answerValue: this.answerValue, id: this.id });
    // console.log(this.id);
  }
}
