import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css'],
})
export class InputComponent {
  @Input() questionValue!: string;
  @Input() answer!: Component;
  @Input() type!: string;
  @Input() inputPlaceholder!: string;
}
