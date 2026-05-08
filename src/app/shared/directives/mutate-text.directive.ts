import { Directive, HostListener, Input, inject } from '@angular/core';
import type { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMutateText]',
  standalone: true,
})
export class MutateTextDirective {
  private control = inject(NgControl);

  @Input() appMutateText: (value: string) => string = (value) => value;

  @HostListener('change')
  onChange(): void {
    this.control.control?.setValue(this.appMutateText(this.control.value));
  }
}
