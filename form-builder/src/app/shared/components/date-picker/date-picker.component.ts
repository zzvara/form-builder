import { Component, Input, TemplateRef } from '@angular/core';

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
  type: string = 'date';
  @Input() sectiondId!: string;
}
