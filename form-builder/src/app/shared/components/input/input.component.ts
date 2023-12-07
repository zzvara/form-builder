import { Component, Input } from '@angular/core';
import { answerType } from '../../answerType.interface';

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  @Input() questionValue: string = '';
  @Input() answerValue: answerType = { isReqired: false };
  @Input() type!: string;
  @Input() inputPlaceholder: string = '';
}
