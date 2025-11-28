import { Pipe, PipeTransform } from '@angular/core';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { RepeatedSectionList, SectionList } from '@app/pages/edit/interfaces/section-list';

@Pipe({
  name: 'instanceOfRepeatedSection'
})
export class InstanceOfRepeatedSectionPipe implements PipeTransform {

  transform(object : any, editList : EditList[]): object is RepeatedSectionList {
    if(object.type === "RepeatedSectionComponent") {
      object.repeatByOther = object.repeatByOther ?? false;
      object.repeatTimes = (object.repeatTimes >= 1) ? object.repeatTimes : 1;
      const ind = editList.findIndex(item => item.id === object.data.id);
      object.referencableInputs = editList.filter((item, i) => (item.data.type === "NumberInputComponent" || item.data.type === "CheckboxGroupComponent") && i < ind && item.data.customTitle).map((item) => item.data.customTitle);
      return true;
    }
    
    return false;
  }

}
