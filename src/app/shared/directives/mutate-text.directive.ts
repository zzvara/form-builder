import { Directive, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMutateText]',
  standalone: true,
})
export class MutateTextDirective {
  @Input() appMutateText: (value: string) => string = (value) => value;

  constructor(private control: NgControl) {}

  @HostListener('change')
  onChange(): void {
    this.control.control?.setValue(this.appMutateText(this.control.value));
  }
}
