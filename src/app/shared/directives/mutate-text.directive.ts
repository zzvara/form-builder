import { Directive, input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMutateText]',
  standalone: true,
  host: {
    '(change)': 'onChange()',
  },
})
export class MutateTextDirective {
  readonly appMutateText = input<(value: string) => string>((value) => value);

  constructor(private control: NgControl) {}

  onChange(): void {
    this.control.control?.setValue(this.appMutateText()(this.control.value));
  }
}