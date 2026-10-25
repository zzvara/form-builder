import { ComponentIconsPipe } from './used-component-icons.pipe';

describe('ComponentIconsPipe', () => {
  it('maps each supported component and falls back for unknown types', () => {
    const pipe = new ComponentIconsPipe();
    const icons = {
      InputComponent: 'font-size',
      NumberInputComponent: 'number',
      DatePickerComponent: 'calendar',
      RangePickerComponent: 'column-width',
      TimePickerComponent: 'clock-circle',
      TextareaComponent: 'menu',
      PictureInputComponent: 'picture',
      SelectComponent: 'down',
      RadioGroupComponent: 'check-circle',
      CheckboxGroupComponent: 'check-square',
      SectionComponent: 'layout',
      RepeatedSectionComponent: 'interaction',
    };
    for (const [type, icon] of Object.entries(icons)) expect(pipe.transform(type)).toBe(icon);
    expect(pipe.transform('unknown')).toBe('question-circle');
  });
});
