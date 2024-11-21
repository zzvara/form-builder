import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {SectionComponent} from "../section/section.component";
import {identifyGroupContents, identifySidebarData, SidebarData} from "./interfaces/sidebar-data";


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  protected readonly identifySidebarData = identifySidebarData;
  protected readonly identifyGroupContents = identifyGroupContents;
  protected readonly SectionComponent = SectionComponent;

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
