import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SidebarData} from "./interfaces/sidebar-data";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  constructor() {}

  @Input() sidebarData!: SidebarData[];
}
