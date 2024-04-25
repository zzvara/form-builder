import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  questionValue: string = 'Text Input';
  descriptionValue: string = 'The input can be used for...';
  answerValue: any = 'Input answer';
  inputPlaceholder: string = 'Input input value';
  @Input() sectiondId!: string;
  @Input() type!: string;
}
