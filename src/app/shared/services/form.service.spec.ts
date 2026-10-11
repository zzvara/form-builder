import { TestBed } from '@angular/core/testing';
import { FormService } from './form.service';

describe('FormService', () => {
  it('creates a name form with required, identifier, and uniqueness validation', () => {
    const form = TestBed.inject(FormService).createComponentNameForm(['existing']);
    const name = form.controls['name'];
    expect(name.hasError('required')).toBeTrue();
    name.setValue('existing');
    expect(name.hasError('notUnique')).toBeTrue();
    name.setValue('invalid-name');
    expect(name.hasError('invalidJsVariableName')).toBeTrue();
    name.setValue('validName');
    expect(form.valid).toBeTrue();
    expect(form.updateOn).toBe('change');
  });
  
  it('accepts an initial name and supports resetting the form', () => {
    const form = TestBed.inject(FormService).createComponentNameForm([], 'answer');
    expect(form.value).toEqual({ name: 'answer' });
    form.reset();
    expect(form.controls['name'].hasError('required')).toBeTrue();
  });
});
