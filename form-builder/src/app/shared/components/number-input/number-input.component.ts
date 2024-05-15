import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent {
  @Input() id!: string;
  @Input() type!: string;
  @Input() questionValue: string = 'Number Input';

  descriptionValue: string = 'The input can be used for...';
  @Input() answerValue: any = 0;
  inputPlaceholder: string = 'Number input value';
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
