import type { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import type { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface ColumnItem {
  title: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Questionnaire> | null;
  sortDirections: NzTableSortOrder[];
  width?: string;
  minWidth?: string;
}
