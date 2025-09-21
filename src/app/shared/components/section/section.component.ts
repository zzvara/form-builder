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
  // @todo In that case can we destroy it?
  // Correction: Not entirely unused it. It is indeed utilized as a 'type' in edit-data-config.ts and in the Sidebar as a draggable component. However that's it.
  // After it gets dragged onto the edit component it looses it's use. It should be reformatted as such that either it should be utilized in the edit container as well or completely removed.
}
