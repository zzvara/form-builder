import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.css'],
})
export class NumberInputComponent {
  questionValue: string = 'Number Input';
  descriptionValue: string = 'The input can be used for...';
  answerValue: any = 0;
  inputPlaceholder: string = 'Number input value';
  @Input() sectiondId!: string;
  type: string = 'number';
}
