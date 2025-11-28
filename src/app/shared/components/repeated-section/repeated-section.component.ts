import { Component, Input } from '@angular/core';
import { FormComponentMarker } from '@interfaces/form-component-marker';
import { SectionComponent } from '../section/section.component';

@Component({
  selector: 'app-repeated-section',
  templateUrl: './repeated-section.component.html',
  styleUrls: [],
  standalone: false,
})
export class RepeatedSectionComponent extends SectionComponent implements FormComponentMarker {
}
