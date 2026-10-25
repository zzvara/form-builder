import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import type { SectionList } from '@app/pages/edit/interfaces/section-list';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';

@Pipe({
  name: 'instanceOfSectionList',
  standalone: true,
})
export class InstanceOfSectionListPipe implements PipeTransform {
  transform(object: unknown): object is SectionList {
    if (typeof object !== 'object' || object === null) return false;
    const section = object as Partial<SectionList> & { id?: string };
    if (
      ('sectionId' in section && 'layout' in section && 'sectionInputs' in section) ||
      section.type === 'SectionComponent' ||
      section.type === 'RepeatedSectionComponent'
    ) {
      section.sectionId = section.sectionId ?? section.id;
      section.layout = section.layout ?? LayoutEnum.VERTICAL;
      section.sectionInputs = section.sectionInputs ?? [];
      return true;
    } else {
      return false;
    }
  }
}
