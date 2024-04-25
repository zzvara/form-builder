import { Component, Input, TemplateRef } from '@angular/core';
import { answerType } from '../../answerType.interface';

@Component({
  selector: 'app-input-layout',
  templateUrl: './input-layout.component.html',
  styleUrls: ['./input-layout.component.css'],
})
export class InputLayoutComponent {
  @Input() questionValue: string = 'xxx';
  @Input() descriptionValue: string = 'xxx...';
  @Input() answerValue!: any ;
  @Input() type: string = 'text';
  @Input() inputPlaceholder: string = '';
  @Input() sectiondId!: string;
  @Input() inputTemplate!: TemplateRef<any>;
  isEditingQuestion: boolean = false;
  isEditingDescription: boolean = false;
  isSwitchingAdornment: boolean = false;
}
