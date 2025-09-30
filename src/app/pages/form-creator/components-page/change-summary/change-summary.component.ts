import { Component, OnInit, OnChanges, Input, SimpleChanges, Optional, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  imports: [CommonModule, NzIconModule, TranslatePipe, IconTypePipe],
  templateUrl: './change-summary.component.html',
  styleUrls: ['./change-summary.component.less'],
})
export class ChangeSummaryComponent implements OnInit, OnChanges {
  @Input() items: ChangeInput[] = [];

  diffItems: DiffItem[] = [];

  constructor(
    @Optional()
    @Inject(NZ_MODAL_DATA)
    private modalData: { items: ChangeInput[] } | null,
    private modalRef: NzModalRef
  ) {}

  ngOnInit(): void {
    // If opened as a modal, build diffs from the injected data
    if (this.modalData) {
      this.buildDiffs(this.modalData.items);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // If used inline (popover), rebuild diffs whenever @Input() items change
    if (changes['items'] && !this.modalData) {
      this.buildDiffs(this.items);
    }
  }

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
  private buildDiffs(rawItems: ChangeInput[]): void {
    if (!rawItems || rawItems.length === 0) {
      this.diffItems = [
        {
          key: 'editList',
          open: true,
          addedItems: [],
          removedItems: [],
        },
      ];
      return;
    }

    this.diffItems = rawItems.map((item) => {
      const beforeArr = this.safeParseArray(item.before);
      const afterArr = this.safeParseArray(item.after);
      const added = afterArr.filter((a) => !beforeArr.some((b) => b.id === a.id));
      const removed = beforeArr.filter((b) => !afterArr.some((a) => a.id === b.id));
      return { key: item.key, open: false, addedItems: added, removedItems: removed };
    });

    const hasChanges = this.diffItems.some((d) => d.addedItems.length > 0 || d.removedItems.length > 0);
    if (!hasChanges) {
      // No real changes: show a placeholder section instead of leaving it blank
      this.diffItems = [
        {
          key: 'editList',
          open: true,
          addedItems: [],
          removedItems: [],
        },
      ];
    }
  }

  toggle(d: DiffItem): void {
    d.open = !d.open;
  }

  close(): void {
    this.modalRef?.close();
  }
}
