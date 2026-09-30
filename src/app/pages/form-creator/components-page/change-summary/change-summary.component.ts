import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Optional,
  computed,
  input,
} from '@angular/core';

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { TranslatePipe } from '@ngx-translate/core';
import { IconTypePipe } from '@app/shared/pipes/icon-type.pipe';

interface RawItem {
  id: string;
  data: { title: string; type: string };
}
interface ChangeInput {
  key: string;
  before: any;
  after: any;
}
interface DiffItem {
  key: string;
  open: boolean;
  addedItems: RawItem[];
  removedItems: RawItem[];
}

@Component({
  selector: 'app-change-summary',
  standalone: true,
  imports: [NzIconModule, TranslatePipe, IconTypePipe],
  templateUrl: './change-summary.component.html',
  styleUrls: ['./change-summary.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeSummaryComponent {
  readonly items = input<ChangeInput[]>([]);

  // If opened as a modal, the diffs are built from the injected data,
  // if used inline (popover), they are rebuilt whenever the items input changes
  readonly diffItems = computed<DiffItem[]>(() =>
    this.buildDiffs(this.modalData ? this.modalData.items : this.items()),
  );

  constructor(
    @Optional()
    @Inject(NZ_MODAL_DATA)
    private modalData: { items: ChangeInput[] } | null,
    private modalRef: NzModalRef,
  ) {}

  /**
   * Safely parse a JSON string into an array of RawItem.
   * If the input is not a string or is invalid JSON, return an empty array.
   */
  private safeParseArray(raw: any): RawItem[] {
    if (typeof raw !== 'string') return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as RawItem[]) : [];
    } catch {
      return [];
    }
  }

  /**
   * Generate diffItems based on the provided raw items.
   * If there are no items or no actual changes, fall back to a single 'editList' section.
   */
  private buildDiffs(rawItems: ChangeInput[]): DiffItem[] {
    if (!rawItems || rawItems.length === 0) {
      return [
        {
          key: 'editList',
          open: true,
          addedItems: [],
          removedItems: [],
        },
      ];
    }

    const diffItems = rawItems.map((item) => {
      const beforeArr = this.safeParseArray(item.before);
      const afterArr = this.safeParseArray(item.after);
      const added = afterArr.filter((a) => !beforeArr.some((b) => b.id === a.id));
      const removed = beforeArr.filter((b) => !afterArr.some((a) => a.id === b.id));
      return { key: item.key, open: false, addedItems: added, removedItems: removed };
    });

    const hasChanges = diffItems.some(
      (d) => d.addedItems.length > 0 || d.removedItems.length > 0,
    );
    if (!hasChanges) {
      // No real changes: show a placeholder section instead of leaving it blank
      return [
        {
          key: 'editList',
          open: true,
          addedItems: [],
          removedItems: [],
        },
      ];
    }
    return diffItems;
  }

  close(): void {
    this.modalRef?.close();
  }
}
