import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { RepeatedSectionList } from '@app/pages/edit/interfaces/section-list';

@Pipe({
  name: 'instanceOfRepeatedSection',
})
export class InstanceOfRepeatedSectionPipe implements PipeTransform {
  transform(object: unknown): object is RepeatedSectionList {
    if (typeof object !== 'object' || object === null) return false;
    const section = object as Partial<RepeatedSectionList>;
    if (section.type === 'RepeatedSectionComponent') {
      section.repeatByOther = section.repeatByOther ?? false;
      section.repeatTimes =
        typeof section.repeatTimes === 'number' && section.repeatTimes >= 1
          ? section.repeatTimes
          : 1;
      section.referencableInputs = section.referencableInputs ?? [];
      return true;
    }

    return false;
  }
}
