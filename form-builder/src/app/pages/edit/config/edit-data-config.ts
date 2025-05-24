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
import {TranslateService} from "@ngx-translate/core";

// Default values of the dragged components
const textInputOptions: InputComponentData = {
  required: false,
  requiredMessage: 'Field cannot be empty!',
  minLength: false,
  minLengthMessage: 'Field value cannot be shorter than: {*} characters!',
  maxLength: false,
  showTooltip: false,
  showCharacterCounter: false,
};
const numberInputOptions: NumberInputComponentData = {
  required: false,
  requiredMessage: 'Field cannot be empty!',
  showTooltip: false,
  max: false,
  min: false,
  stepNumber: 1,
  format: false,
};
const dateInputOptions: DatePickerComponentData = {
  required: false,
  requiredMessage: 'Field cannot be empty!',
  showTooltip: false,
  dateFormat: defaultDateFormats.date,
  timeFormat: ' ' + defaultDateFormats.time,
  inlineMode: false,
  maxDate: false,
  minDate: false,
  mode: 'date',
  showTime: false,
  showWeekNumber: false,
};
const rangeInputOptions: RangePickerComponentData = {
  required: false,
  requiredMessage: 'Field cannot be empty!',
  showTooltip: false,
  dateFormat: defaultDateFormats.date,
  timeFormat: ' ' + defaultDateFormats.time,
  inlineMode: false,
  maxDate: false,
  minDate: false,
  mode: 'date',
  showTime: false,
  showWeekNumber: false,
};
const timeInputOptions: TimePickerComponentData = {
  required: false,
  requiredMessage: 'Field cannot be empty!',
  showTooltip: false,
  maxTime: false,
  minTime: false,
  use12Hours: false,
  timeFormat: defaultDateFormats.time,
  hideDisabledOptions: false,
  hourStep: 1,
  minuteStep: 1,
  secondStep: 1,
};
const textAreaInputOptions: TextareaComponentData = {
  required: false,
  requiredMessage: 'Field cannot be empty!',
  minLength: false,
  minLengthMessage: 'Field value cannot be shorter than: {*} characters!',
  maxLength: false,
  showTooltip: false,
  showCharacterCounter: false,
};
const pictureInputOptions: PictureInputComponentData = {};
const selectInputOptions: SelectComponentData = {
  selectOptions: ['Option 1', 'Option 2'],
  required: false,
  requiredMessage: 'Field cannot be empty!',
  showTooltip: false,
  isMultipleChoice: false,
};
const radioGroupInputOptions: RadioGroupData = {
  required: false,
  requiredMessage: 'Do not leave empty!',
  isButton: false,
  options: [
    { option_id: 1, option_description: 'Option 1' },
    { option_id: 2, option_description: 'Option 2' },
    { option_id: 3, option_description: 'Option 3' },
  ],
};
const checkboxGroupInputOptions: CheckboxGroupData = {
  required: false,
  requiredMessage: 'Do not leave empty!',
  defaultValue: [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
    { label: 'Option 3', value: 3 },
  ],
};

//Used for resetting inputs
export function getInputGroups(translate: TranslateService): FormInputData<any>[] {
  return [
    {
      title: 'TEXT FIELD',
      type: 'InputComponent',
      data: textInputOptions,
    },
    {
      title: 'NUMBER FIELD',
      type: 'NumberInputComponent',
      data: numberInputOptions,
    },
    {
      title: 'DATE PICKER',
      type: 'DatePickerComponent',
      data: dateInputOptions,
    },
    {
      title: 'RANGE PICKER',
      type: 'RangePickerComponent',
      data: rangeInputOptions,
    },
    {
      title: 'TIME PICKER',
      type: 'TimePickerComponent',
      data: timeInputOptions,
    },
    {
      title: 'TEXT AREA',
      type: 'TextareaComponent',
      data: textAreaInputOptions,
    },
    {
      title: 'PICTURE INPUT',
      type: 'PictureInputComponent',
      data: pictureInputOptions,
    },
    {
      title: 'COMBOBOX',
      type: 'SelectComponent',
      data: selectInputOptions,
    },
    {
      title: 'RADIO GROUP',
      type: 'RadioGroupComponent',
      data: radioGroupInputOptions,
    },
    {
      title: 'CHECKBOX GROUP',
      type: 'CheckboxGroupComponent',
      data: checkboxGroupInputOptions,
    },
  ];
}



// The data shown in the edit sidebar
export function getSideBarData(component: EditComponent, translate: TranslateService): SidebarData[] {
  return [
    {
      groupName: translate.instant('components.BASIC_INPUTS'),
      active: true,
      dropListConnectedTo: () => component.getSectionIds().concat(['sectionDropList']),
      groupContents: getInputGroups(translate),
    },
    {
      groupName: translate.instant('components.SECTIONS'),
      active: true,
      dropListConnectedTo: () => 'sectionDropList',
      groupContents: [
        {
          title: translate.instant('components.SECTION'),
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
