import { Pipe, PipeTransform } from '@angular/core';
import { RepeatedSectionList } from '@app/pages/edit/interfaces/section-list';

@Pipe({
  name: 'instanceOfRepeatedSection',
})
export class InstanceOfRepeatedSectionPipe implements PipeTransform {
  transform(object: any): object is RepeatedSectionList {
    if (object.type === 'RepeatedSectionComponent') {
      object.repeatByOther = object.repeatByOther ?? false;
      object.repeatTimes = object.repeatTimes >= 1 ? object.repeatTimes : 1;
      object.referencableInputs = object.referencableInputs ?? [];
      return true;
    }

    return false;
  }
}
