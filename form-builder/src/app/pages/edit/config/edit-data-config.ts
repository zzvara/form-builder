import {DatePickerComponent} from "../../../shared/components/date-picker/date-picker.component";
import {DatePickerComponentData} from "../../../shared/components/date-picker/interfaces/date-picker-component-data";
import {InputComponent} from "../../../shared/components/input/input.component";
import {InputComponentData} from "../../../shared/components/input/interfaces/input-component-data";
import {NumberInputComponentData} from "../../../shared/components/number-input/interfaces/number-input-component-data";
import {NumberInputComponent} from "../../../shared/components/number-input/number-input.component";
import {
  PictureInputComponentData
} from "../../../shared/components/picture-input/interfaces/picture-input-component-data";
import {PictureInputComponent} from "../../../shared/components/picture-input/picture-input.component";
import {SectionComponent} from "../../../shared/components/section/section.component";
import {SelectComponentData} from "../../../shared/components/select/interfaces/select-component-data";
import {SelectComponent} from "../../../shared/components/select/select.component";
import {SidebarData} from "../../../shared/components/sidebar/interfaces/sidebar-data";
import {TextareaComponentData} from "../../../shared/components/textarea/interfaces/textarea-component-data";
import {TextareaComponent} from "../../../shared/components/textarea/textarea.component";
import {EditComponent} from "../edit.component";
import {FormInputData} from "../../../shared/interfaces/form-input-data";

// Default values of the dragged components
const textInputOptions: InputComponentData = {
  questionValue: "Text Field question...",
  descriptionValue: "Question description...",
  placeholderValue: ""
};
const numberInputOptions: NumberInputComponentData = {
  questionValue: "Number Field question...",
  descriptionValue: "Question description...",
  placeholderValue: ""
};
const dateInputOptions: DatePickerComponentData = {
  questionValue: "Date Picker question...",
  descriptionValue: "Question description...",
  placeholderValue: ""
};
const textAreaInputOptions: TextareaComponentData = {
  questionValue: "Text area question...",
  descriptionValue: "Question description...",
  placeholderValue: ""
};
const pictureInputOptions: PictureInputComponentData = {
  questionValue: "Picture Input question...",
  descriptionValue: "Question description...",
  placeholderValue: ""
};
const selectInputOptions: SelectComponentData = {
  questionValue: "ComboBox question...",
  descriptionValue: "Question description...",
  placeholderValue: "",
  selectOptions: ["Option 1", "Option 2"],
  isMultipleChoice: false
};

export function getInputGroups(): FormInputData<any, any>[] {
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
      dropListConnectedTo: () => component.getSectionIds(),
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
