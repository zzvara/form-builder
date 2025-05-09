import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import * as Diff from 'diff';

interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}
interface DiffItem {
  key: string;
  parts: DiffPart[];
  open: boolean; 
}

@Component({
  selector: 'app-change-summary',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './change-summary.component.html',
  styleUrls: ['./change-summary.component.less']
})
export class ChangeSummaryComponent implements OnInit {
  // ide érkezik majd a modalból a data
  private readonly data = inject(NZ_MODAL_DATA) as { items: { key: string; before: any; after: any }[] };
  diffItems: DiffItem[] = [];
  private readonly modalRef = inject(NzModalRef);

  ngOnInit(): void {
    this.diffItems = this.data.items.map(item => {
      const parts = Diff.diffWordsWithSpace(
        JSON.stringify(item.before, null, 2),
        JSON.stringify(item.after,  null, 2)
      );
      return {
        key: item.key,
        parts,
        open: false };
    });
  }

  close(): void {
    this.modalRef.close();
  }
}
