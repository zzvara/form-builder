import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { appConfig } from '@app/app.config';
import { TextareaComponent } from '@components/textarea/textarea.component';

describe('AbstractFieldLikeInputs', () => {
  it('shows the configured required message only for matching validation errors', () => {
    TestBed.configureTestingModule({
      imports: [TextareaComponent],
      providers: appConfig.providers,
    });
    const fixture = TestBed.createComponent(TextareaComponent);
    const component = fixture.componentInstance;
    component.data = {
      required: true,
      requiredMessage: 'Please answer',
      showTooltip: false,
      minLength: false,
      maxLength: false,
      showCharacterCounter: false,
    };
    const control = new FormControl('', { nonNullable: true });
    expect(component.getErrorMessages(control)).toEqual([]);
    control.setErrors({ required: true, unrelated: true });
    expect(component.getErrorMessages(control)).toEqual(['Please answer']);
  });
});
