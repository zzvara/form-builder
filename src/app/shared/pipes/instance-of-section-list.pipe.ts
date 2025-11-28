import { Pipe, PipeTransform } from '@angular/core';
import { SectionList } from '@app/pages/edit/interfaces/section-list';

@Pipe({
  name: 'instanceOfSectionList',
  standalone: true,
})
export class InstanceOfSectionListPipe implements PipeTransform {
  transform(object: any): object is SectionList {
    if(object && 'sectionId' in object && 'layout' in object && 'sectionInputs' in object || object.type == "SectionComponent" || object.type == "RepeatedSectionComponent") {
      object.sectionId = object.sectionId ?? object.id;
      object.layout = object.layout ?? 'vertical';
      object.sectionInputs = object.sectionInputs ?? [];
      return true;
    } else {
      return false;
    }
  }
}
