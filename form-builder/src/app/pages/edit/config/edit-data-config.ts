import {DatePickerComponent} from "../../../shared/components/date-picker/date-picker.component";
import {DatePickerComponentData} from "../../../shared/components/date-picker/interfaces/date-picker-component-data";
import {defaultDateFormats} from "../../../shared/components/date-picker/interfaces/default-date-formats";
import {InputComponent} from "../../../shared/components/input/input.component";
import {InputComponentData} from "../../../shared/components/input/interfaces/input-component-data";
import {NumberInputComponentData} from "../../../shared/components/number-input/interfaces/number-input-component-data";
import {NumberInputComponent} from "../../../shared/components/number-input/number-input.component";
import {PictureInputComponentData} from "../../../shared/components/picture-input/interfaces/picture-input-component-data";
import {PictureInputComponent} from "../../../shared/components/picture-input/picture-input.component";
import {RangePickerComponentData} from "../../../shared/components/range-picker/interfaces/range-picker-component-data";
import {RangePickerComponent} from "../../../shared/components/range-picker/range-picker.component";
import {SectionComponent} from "../../../shared/components/section/section.component";
import {SelectComponentData} from "../../../shared/components/select/interfaces/select-component-data";
import {SelectComponent} from "../../../shared/components/select/select.component";
import {SidebarData} from "../../../shared/components/sidebar/interfaces/sidebar-data";
import {TextareaComponentData} from "../../../shared/components/textarea/interfaces/textarea-component-data";
import {TextareaComponent} from "../../../shared/components/textarea/textarea.component";
import {TimePickerComponentData} from "../../../shared/components/time-picker/interfaces/time-picker-component-data";
import {TimePickerComponent} from "../../../shared/components/time-picker/time-picker.component";
import {FormInputData} from "../../../shared/interfaces/form-input-data";
import {EditComponent} from "../edit.component";

// Default values of the dragged components
const textInputOptions: InputComponentData = {
  questionValue: "Text Field question...",
  descriptionValue: "Question description...",
  required: false,
  requiredMessage: "Field cannot be empty!",
  minLength: false,
  minLengthMessage: "Field value cannot be shorter than: {*} characters!",
  maxLength: false,
  showTooltip: false,
  showCharacterCounter: false,
};
const numberInputOptions: NumberInputComponentData = {
  questionValue: "Number Field question...",
  descriptionValue: "Question description...",
  required: false,
  requiredMessage: "Field cannot be empty!",
  showTooltip: false,
  max: false,
  min: false,
  stepNumber: 1,
  format: false
};
const dateInputOptions: DatePickerComponentData = {
  questionValue: "Date Picker question...",
  descriptionValue: "Question description...",
  required: false,
  requiredMessage: "Field cannot be empty!",
  showTooltip: false,
  dateFormat: defaultDateFormats.date,
  timeFormat: " " + defaultDateFormats.time,
  inlineMode: false,
  maxDate: false,
  minDate: false,
  mode: "date",
  showTime: false,
  showWeekNumber: false,
};
const rangeInputOptions: RangePickerComponentData = {
  questionValue: "Range Picker question...",
  descriptionValue: "Question description...",
  required: false,
  requiredMessage: "Field cannot be empty!",
  showTooltip: false,
  dateFormat: defaultDateFormats.date,
  timeFormat: " " + defaultDateFormats.time,
  inlineMode: false,
  maxDate: false,
  minDate: false,
  mode: "date",
  showTime: false,
  showWeekNumber: false,
};
const timeInputOptions: TimePickerComponentData = {
  questionValue: "Time Picker question...",
  descriptionValue: "Question description...",
  required: false,
  requiredMessage: "Field cannot be empty!",
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
  questionValue: "Textarea question...",
  descriptionValue: "Question description...",
  required: false,
  requiredMessage: "Field cannot be empty!",
  minLength: false,
  minLengthMessage: "Field value cannot be shorter than: {*} characters!",
  maxLength: false,
  showTooltip: false,
  showCharacterCounter: false,
};
const pictureInputOptions: PictureInputComponentData = {
  questionValue: "Picture Input question...",
  descriptionValue: "Question description...",
};
const selectInputOptions: SelectComponentData = {
  questionValue: "ComboBox question...",
  descriptionValue: "Question description...",
  selectOptions: ["Option 1", "Option 2"],
  required: false,
  requiredMessage: "Field cannot be empty!",
  showTooltip: false,
  isMultipleChoice: false,
};

//Used for resetting inputs
export function getInputGroups(): FormInputData<any>[] {
  return [
    {
      title: "TEXT FIELD",
      type: InputComponent,
      data: textInputOptions
    },
    {
      title: "NUMBER FIELD",
      type: NumberInputComponent,
      data: numberInputOptions
    },
    {
      title: "DATE PICKER",
      type: DatePickerComponent,
      data: dateInputOptions
    },
    {
      title: "RANGE PICKER",
      type: RangePickerComponent,
      data: rangeInputOptions
    },
    {
      title: "TIME PICKER",
      type: TimePickerComponent,
      data: timeInputOptions
    },
    {
      title: "TEXT AREA",
      type: TextareaComponent,
      data: textAreaInputOptions
    },
    {
      title: "PICTURE INPUT",
      type: PictureInputComponent,
      data: pictureInputOptions
    },
    {
      title: "COMBOBOX",
      type: SelectComponent,
      data: selectInputOptions
    },
  ];
}

// The data shown in the edit sidebar
export function getSideBarData(component: EditComponent): SidebarData[] {
  return [
    {
      groupName: "Basic inputs",
      active: true,
      dropListConnectedTo: () => component.getSectionIds().concat(["sectionDropList"]),
      groupContents: getInputGroups()
    },{
      groupName: "Sections",
      active: true,
      dropListConnectedTo: () => "sectionDropList",
      groupContents: [{
        title: "SECTION",
        type: SectionComponent,
        data: null
      }]
    }];
}
