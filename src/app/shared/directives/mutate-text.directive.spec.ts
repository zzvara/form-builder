import type { NgControl } from '@angular/forms';
import { MutateTextDirective } from '@directives/mutate-text.directive';

describe('MutateTextDirective', () => {
  it('should create an instance', () => {
    const control = jasmine.createSpyObj<NgControl>('NgControl', ['viewToModelUpdate']);
    const directive = new MutateTextDirective(control);
    expect(directive).toBeTruthy();
  });
});
