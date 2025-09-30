import { Pipe, PipeTransform } from '@angular/core';
import { SectionList } from '@app/pages/edit/interfaces/section-list';

@Pipe({
  name: 'instanceOfSectionList',
  standalone: true,
})
export class InstanceOfSectionListPipe implements PipeTransform {
  transform(object: any): object is SectionList {
    return object && 'sectionId' in object && 'layout' in object && 'sectionInputs' in object;
  }
}
