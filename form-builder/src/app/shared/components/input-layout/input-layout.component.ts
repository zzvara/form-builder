import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-input-layout',
  templateUrl: './input-layout.component.html',
  styleUrls: ['./input-layout.component.css'],
})
export class InputLayoutComponent {
  @Input() componentId!: string;
  @Input() questionValue!: string;
  @Input() descriptionValue!: string;
  @Input() type: string = 'text';
  @Input() inputPlaceholder: string = '';
  @Input() sectiondId!: string;
  @Input() inputTemplate!: TemplateRef<any>;
  isEditingQuestion: boolean = false;
  isEditingDescription: boolean = false;
  isSwitchingAdornment: boolean = false;

  // Input-Layout component gives all the draggable components a layout
  // There's an option to click on the question and descriptionValue to
  // change it according to the users' need.
  // WIP: there are also adornments that would indicate if the current
  // input element is required or not. For this I created the boolean
  // variable, but in the current version it does NOT work as it should.
  // When user clicks on the questionValue the adornment disappears/ or
  // when user clicks on the adornment it also handles it like the user
  // wants to change the question

  @Output() questionValueChanged = new EventEmitter<string>();
  @Output() descriptionValueChanged = new EventEmitter<string>();
  @Output() removeComponentEvent = new EventEmitter<string>();

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
  }

  emitDescriptionValue() {
    this.descriptionValueChanged.emit(this.descriptionValue);
  }

  removeComponent() {
    this.removeComponentEvent.emit(this.componentId);
  }
}
