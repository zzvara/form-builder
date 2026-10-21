import { MutateTextDirective } from '@directives/mutate-text.directive';
import { FormControl, NgControl } from '@angular/forms';
import { TestBed } from '@angular/core/testing';

describe('MutateTextDirective', () => {
  it('should create an instance', () => {
    const control = jasmine.createSpyObj<NgControl>('NgControl', [], {
      control: new FormControl('value'),
      value: 'value',
    });
    TestBed.configureTestingModule({ providers: [{ provide: NgControl, useValue: control }] });
    const directive = TestBed.runInInjectionContext(() => new MutateTextDirective());
    expect(directive).toBeTruthy();
  });
});
