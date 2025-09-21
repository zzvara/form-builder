import { CheckboxGroupComponent } from '@components/checkbox-group/checkbox-group.component';
import { CheckboxGroupData } from '@components/checkbox-group/interfaces/checkbox-group-data';
import { DatePickerComponent } from '@components/date-picker/date-picker.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';
import { defaultDateFormats } from '@components/date-picker/interfaces/default-date-formats';
import { InputComponent } from '@components/input/input.component';
import { InputComponentData } from '@components/input/interfaces/input-component-data';
import { NumberInputComponentData } from '@components/number-input/interfaces/number-input-component-data';
import { NumberInputComponent } from '@components/number-input/number-input.component';
import { PictureInputComponentData } from '@components/picture-input/interfaces/picture-input-component-data';
import { PictureInputComponent } from '@components/picture-input/picture-input.component';
import { RadioGroupData } from '@components/radio-group/interfaces/radio-group-data';
import { RadioGroupComponent } from '@components/radio-group/radio-group.component';
import { RangePickerComponentData } from '@components/range-picker/interfaces/range-picker-component-data';
import { RangePickerComponent } from '@components/range-picker/range-picker.component';
import { SectionComponent } from '@components/section/section.component';
import { SelectComponentData } from '@components/select/interfaces/select-component-data';
import { SelectComponent } from '@components/select/select.component';
import { SidebarData } from '@components/sidebar/interfaces/sidebar-data';
import { TextareaComponentData } from '@components/textarea/interfaces/textarea-component-data';
import { TextareaComponent } from '@components/textarea/textarea.component';
import { TimePickerComponentData } from '@components/time-picker/interfaces/time-picker-component-data';
import { TimePickerComponent } from '@components/time-picker/time-picker.component';
import { EditComponent } from '@pages/edit/edit.component';
import { FormInputData } from '@interfaces/form-input-data';
import { TranslateService } from '@ngx-translate/core';

// Default values of the dragged components
const textInputOptions = (translateService: TranslateService): InputComponentData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  minLength: false,
  minLengthMessage: translateService.instant('components.MIN_LENGTH_MESSAGE'),
  maxLength: false,
  showTooltip: false,
  showCharacterCounter: false,
});
const numberInputOptions = (translateService: TranslateService): NumberInputComponentData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  showTooltip: false,
  max: false,
  min: false,
  stepNumber: 1,
  format: false,
});
const dateInputOptions = (translateService: TranslateService): DatePickerComponentData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  showTooltip: false,
  dateFormat: defaultDateFormats.date,
  timeFormat: ' ' + defaultDateFormats.time,
  inlineMode: false,
  maxDate: false,
  minDate: false,
  mode: 'date',
  showTime: false,
  showWeekNumber: false,
});
const rangeInputOptions = (translateService: TranslateService): RangePickerComponentData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  showTooltip: false,
  dateFormat: defaultDateFormats.date,
  timeFormat: ' ' + defaultDateFormats.time,
  inlineMode: false,
  maxDate: false,
  minDate: false,
  mode: 'date',
  showTime: false,
  showWeekNumber: false,
});
const timeInputOptions = (translateService: TranslateService): TimePickerComponentData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  showTooltip: false,
  maxTime: false,
  minTime: false,
  use12Hours: false,
  timeFormat: defaultDateFormats.time,
  hideDisabledOptions: false,
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
});
const textAreaInputOptions = (translateService: TranslateService): TextareaComponentData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  minLength: false,
  minLengthMessage: translateService.instant('components.MIN_LENGTH_MESSAGE'),
  maxLength: false,
  showTooltip: false,
  showCharacterCounter: false,
});
const pictureInputOptions: PictureInputComponentData = {};

const selectInputOptions = (translateService: TranslateService): SelectComponentData => ({
  selectOptions: ['Option 1', 'Option 2'],
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  showTooltip: false,
  isMultipleChoice: false,
});
const radioGroupInputOptions = (translateService: TranslateService): RadioGroupData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  isButton: false,
  options: [
    { option_id: 1, option_description: 'Option 1' },
    { option_id: 2, option_description: 'Option 2' },
    { option_id: 3, option_description: 'Option 3' },
  ],
});
const checkboxGroupInputOptions = (translateService: TranslateService): CheckboxGroupData => ({
  required: false,
  requiredMessage: translateService.instant('components.REQUIRED_MESSAGE'),
  defaultValue: [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ],
});

//Used for resetting inputs
export function getInputGroups(translate: TranslateService): FormInputData<any>[] {
  return [
    {
      title: 'components.TEXT_FIELD',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'InputComponent',
      data: textInputOptions(translate),
    },
    {
      title: 'components.NUMBER_FIELD',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'NumberInputComponent',
      data: numberInputOptions(translate),
    },
    {
      title: 'components.DATE_PICKER',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'DatePickerComponent',
      data: dateInputOptions(translate),
    },
    {
      title: 'components.RANGE_PICKER',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'RangePickerComponent',
      data: rangeInputOptions(translate),
    },
    {
      title: 'components.TIME_PICKER',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'TimePickerComponent',
      data: timeInputOptions(translate),
    },
    {
      title: 'components.TEXT_AREA',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'TextareaComponent',
      data: textAreaInputOptions(translate),
    },
    {
      title: 'components.PICTURE_INPUT',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'PictureInputComponent',
      data: pictureInputOptions,
    },
    {
      title: 'components.COMBOBOX',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'SelectComponent',
      data: selectInputOptions(translate),
    },
    {
      title: 'components.RADIO_GROUP',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'RadioGroupComponent',
      data: radioGroupInputOptions(translate),
    },
    {
      title: 'components.CHECKBOX_GROUP',
      questionPlaceholder: '',
      descriptionPlaceholder: '',
      type: 'CheckboxGroupComponent',
      data: checkboxGroupInputOptions(translate),
    },
  ];
}

// The data shown in the edit sidebar
export function getSideBarData(component: EditComponent, translate: TranslateService): SidebarData[] {
  return [
    {
      groupName: 'components.BASIC_INPUTS',
      active: true,
      dropListConnectedTo: () => component.getSectionIds().concat(['sectionDropList']),
      groupContents: getInputGroups(translate),
    },
    {
      groupName: 'components.SECTIONS',
      active: true,
      dropListConnectedTo: () => 'sectionDropList',
      groupContents: [
        {
          title: 'components.SECTION',
          type: 'SectionComponent',
          data: null,
        },
      ],
    },
  ];
}

export const translateComponentType = {
  InputComponent: InputComponent,
  NumberInputComponent: NumberInputComponent,
  DatePickerComponent: DatePickerComponent,
  RangePickerComponent: RangePickerComponent,
  TimePickerComponent: TimePickerComponent,
  TextareaComponent: TextareaComponent,
  PictureInputComponent: PictureInputComponent,
  SelectComponent: SelectComponent,
  RadioGroupComponent: RadioGroupComponent,
  CheckboxGroupComponent: CheckboxGroupComponent,
  SectionComponent: SectionComponent,
};
