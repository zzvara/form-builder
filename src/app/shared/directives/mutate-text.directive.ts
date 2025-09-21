import { Directive, HostListener, inject, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMutateText]',
  standalone: false,
})
export class MutateTextDirective {
  private readonly control: NgControl = inject(NgControl);

  @Input() appMutateText: (value: string) => string = (value) => value;

  constructor() {}

  @HostListener('blur', ['$event'])
  onBlur(): void {
    this.control.control?.setValue(this.appMutateText(this.control.value));
  }
}
