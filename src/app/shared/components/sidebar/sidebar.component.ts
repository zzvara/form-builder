import { DragDropModule } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Input, signal, Signal, WritableSignal, computed, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCollapseComponent, NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { NzInputGroupComponent, NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SidebarData } from '@components/sidebar/interfaces/sidebar-data';
import { InputHolderComponent } from '../input-holder/input-holder.component';

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
export class SidebarComponent implements OnChanges {
  @Input() sidebarData: SidebarData[] = [];

  private readonly _sidebarData: WritableSignal<SidebarData[]> = signal([]);
  private readonly _searchTerm: WritableSignal<string> = signal('');

  public readonly searchTerm: Signal<string> = this._searchTerm.asReadonly();

  public readonly filteredData: Signal<SidebarData[]> = computed(() => {
    const term = this._searchTerm().toLowerCase();
    const data = this._sidebarData();

    if (!term) {
      return data;
    }

    return data
      .map((group) => ({
        ...group,
        groupContents: group.groupContents.filter((item) =>
          item.title.toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.groupContents.length > 0);
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sidebarData']) {
      this._sidebarData.set(this.sidebarData || []);
    }
  }

  onSearchChange(term: string): void {
    this._searchTerm.set(term);
  }

  clearSearch(): void {
    this._searchTerm.set('');
  }
}
