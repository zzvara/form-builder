import { MutateTextDirective } from '@directives/mutate-text.directive';
import { FormControl, NgControl } from '@angular/forms';

describe('MutateTextDirective', () => {
  it('should create an instance', () => {
    const control = jasmine.createSpyObj<NgControl>('NgControl', [], {
      control: new FormControl('value'),
      value: 'value',
    });
    const directive = new MutateTextDirective(control);
    expect(directive).toBeTruthy();
  });
});
