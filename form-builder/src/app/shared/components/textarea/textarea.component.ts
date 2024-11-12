import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import {AbstractInput} from "../../abstract-classes/abstract-input";

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
})
export class TextareaComponent extends AbstractInput {
  inputPlaceholder: string = 'Text area input value';
  inputTemplate!: TemplateRef<any>;
  @Input() textareaPlaceholder!: string;

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
