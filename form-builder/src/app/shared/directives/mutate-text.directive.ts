import { Directive, HostListener, inject, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appMutateText]',
  standalone: false,
})
export class MutateTextDirective {
  private readonly control: NgControl = inject(NgControl);

  @Input() appMutateText: (value: string) => string = (value) => value;
  @Input() mutateParameters: any[] = [];

  constructor() {}

  @HostListener('blur', ['$event'])
  onBlur(): void {
    // @todo I see there are multiple ignored errors in the following like. Are we sure these won't cause issues?
    // @ts-ignore
    this.control.control.setValue(this.appMutateText.call(this.control.value, ...this.mutateParameters));
  }
}
