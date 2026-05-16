import { ChangeDetectionStrategy, Component, Input, signal, Signal, computed, WritableSignal } from '@angular/core';
import { SidebarData } from '@components/sidebar/interfaces/sidebar-data';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Már be volt állítva, szuper!
  standalone: false,
})
export class SidebarComponent {


  private readonly _sidebarData: WritableSignal<SidebarData[]> = signal([]);
  @Input() set sidebarData(value: SidebarData[]) {
    this._sidebarData.set(value || []);
  }

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
        groupContents: group.groupContents.filter((item) => item.title.toLowerCase().includes(term)),
      }))
      .filter((group) => group.groupContents.length > 0);
  });

  onSearchChange(term: string): void {
    this._searchTerm.set(term);
  }

  clearSearch(): void {
    this._searchTerm.set('');
  }
}
