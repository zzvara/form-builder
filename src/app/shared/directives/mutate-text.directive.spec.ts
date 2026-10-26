import { MutateTextDirective } from '@directives/mutate-text.directive';
import { FormControl, NgControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, MutateTextDirective],
  template: '<input [formControl]="control" [appMutateText]="normalize" />',
})
class TextHostComponent {
  control = new FormControl('');
  normalize = (value: string) => value.trim().toUpperCase();
}

describe('MutateTextDirective', () => {
  it('should create an instance', () => {
    const control = jasmine.createSpyObj<NgControl>('NgControl', [], {
      control: new FormControl('value'),
      value: 'value',
    });
    TestBed.configureTestingModule({ providers: [{ provide: NgControl, useValue: control }] });
    const directive = TestBed.runInInjectionContext(() => new MutateTextDirective());
    expect(directive).toBeTruthy();
    directive.onChange();
    expect(control.control!.value).toBe('value');
  });

  it('normalizes the form control when the input emits a change event', () => {
    const fixture = TestBed.createComponent(TextHostComponent);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = '  hello  ';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    expect(fixture.componentInstance.control.value).toBe('HELLO');
    expect(input.value).toBe('HELLO');
  });
});
