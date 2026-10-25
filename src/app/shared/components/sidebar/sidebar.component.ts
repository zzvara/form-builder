import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarData } from '@components/sidebar/interfaces/sidebar-data';
import { TranslatePipe } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseComponent, NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { InputHolderComponent } from '../input-holder/input-holder.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzInputGroupComponent,
    TranslatePipe,
    NzCollapseComponent,
    NzCollapsePanelComponent,
    DragDropModule,
    NzCardModule,
    InputHolderComponent,
    NzInputModule,
    NzIconModule,
  ],
})
export class SidebarComponent implements OnInit {
  @Input() sidebarData: SidebarData[] = [];

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
          groupContents: group.groupContents.filter((item) =>
            item.title.toLowerCase().includes(this.searchTerm.toLowerCase()),
          ),
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
