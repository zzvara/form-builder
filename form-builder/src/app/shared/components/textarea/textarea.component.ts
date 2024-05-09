import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.css'],
})
export class TextareaComponent {
  //questionValue: string = 'Date input';
  descriptionValue: string = 'The input can be used for...';
  //answerValue: any = 'Date answer';
  inputPlaceholder: string = 'Date input value';
  inputTemplate!: TemplateRef<any>;
  type: string = 'text';
  /* @Input() */ questionValue: string = 'Textarea input';
  @Input() answerValue!: Component;
  @Input() textareaPlaceholder!: string;
  @Input() sectiondId!: string;
}
