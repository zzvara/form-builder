import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {identifyGroupContents, identifySidebarData, SidebarData} from "./interfaces/sidebar-data";
import {SectionComponent} from "../section/section.component";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  protected readonly identifySidebarData = identifySidebarData;
  protected readonly identifyGroupContents = identifyGroupContents;
  protected readonly SectionComponent = SectionComponent;

  constructor() {}
  @Input() sidebarData!: SidebarData[];
}
