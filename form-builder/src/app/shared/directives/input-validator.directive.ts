import {Directive, ElementRef, HostBinding, inject} from '@angular/core';

@Directive({
  selector: 'nz-form-control[appInputValidator]'
})
export class InputValidatorDirective {

  private readonly elementRef: ElementRef = inject(ElementRef);


}
