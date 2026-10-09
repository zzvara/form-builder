import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponentMarker } from '@interfaces/form-component-marker';
import { SectionComponent } from '../section/section.component';
import { NzFormItemComponent } from 'ng-zorro-antd/form';
import { NzCardComponent } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-repeated-section',
  templateUrl: './repeated-section.component.html',
  styleUrls: [],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NzFormItemComponent, NzCardComponent],
})
export class RepeatedSectionComponent extends SectionComponent implements FormComponentMarker {}
