import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SidebarData} from '@components/sidebar/interfaces/sidebar-data';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class SidebarComponent implements OnInit {
  @Input() sidebarData!: SidebarData[];

  searchTerm: string = '';
  filteredData: SidebarData[] = [];

  ngOnInit() {
    this.filteredData = this.sidebarData;
  }

  filterItems() {
    if (this.searchTerm) {
      this.filteredData = this.sidebarData
        .map((group) => ({
          ...group,
          groupContents: group.groupContents.filter((item) => item.title.toLowerCase().includes(this.searchTerm.toLowerCase())),
        }))
        .filter((group) => group.groupContents.length > 0);
    } else {
      this.filteredData = this.sidebarData;
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredData = this.sidebarData;
  }
}
