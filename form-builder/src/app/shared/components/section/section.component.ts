import { Component } from '@angular/core';
import { FormComponentMarker } from '@interfaces/form-component-marker';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: [],
  standalone: false,
})
export class SectionComponent implements FormComponentMarker {
  // Egyelőre ennek a komponensnek nincs semmi értelme, mivel az edit.component saját maga generálja le és tárolja a section-ök adatait
}
