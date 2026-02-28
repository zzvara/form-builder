import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ComponentIconsPipe',
  standalone: true,
})
export class ComponentIconsPipe implements PipeTransform {
  private iconMap: Record<string, string> = {
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

  transform(type: string): string {
    return this.iconMap[type] || 'question-circle';
  }
}
