import { Component, EventEmitter, Input, Output, SimpleChanges, TemplateRef } from '@angular/core';
import { answerType } from '../../answerType.interface';

@Component({
  selector: 'app-input-layout',
  templateUrl: './input-layout.component.html',
  styleUrls: ['./input-layout.component.css'],
})
export class InputLayoutComponent {
  @Input() questionValue: string = 'xxx';
  @Input() descriptionValue: string = 'xxx...';
  @Input() answerValue!: any;
  @Input() type: string = 'text';
  @Input() inputPlaceholder: string = '';
  @Input() sectiondId!: string;
  @Input() inputTemplate!: TemplateRef<any>;
  isEditingQuestion: boolean = false;
  isEditingDescription: boolean = false;
  isSwitchingAdornment: boolean = false;

  @Output() questionValueChanged = new EventEmitter<string>();
  @Output() descriptionValueChanged = new EventEmitter<string>();

  onQuestionValueChange(newValue: string) {
    this.questionValue = newValue;
    this.emitQuestionValue();
  }

  onDescriptionValueChange(newValue: string) {
    this.descriptionValue = newValue;
    this.emitDescriptionValue();
  }

  emitQuestionValue() {
    this.questionValueChanged.emit(this.questionValue);
    console.log(this.questionValue);
  }

  emitDescriptionValue() {
    this.descriptionValueChanged.emit(this.descriptionValue);
    console.log(this.descriptionValue);
  }
}
