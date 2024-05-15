import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { answerType } from '../../answerType.interface';

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  @Input() id!: string;
  @Input() type!: string;
  @Input() questionValue: string = 'Text Input';
  descriptionValue: string = 'The input can be used for...';
  answerValue: any;
  inputPlaceholder: string = 'Input input value';
  inputTemplate!: TemplateRef<any>;
  @Input() sectiondId!: string;

  @Output() valueChanged = new EventEmitter<{ questionValue: string; answerValue: string; id: string }>();

  onQuestionValueChange(newValue: string) {
    this.questionValue = newValue;
    this.emitValueChanged();
  }

  onAnswerValueChange(newValue: string) {
    this.answerValue = newValue;
    this.emitValueChanged();
  }

  private emitValueChanged() {
    this.valueChanged.emit({ questionValue: this.questionValue, answerValue: this.answerValue, id: this.id });
    //console.log(this.id);
  }
}
