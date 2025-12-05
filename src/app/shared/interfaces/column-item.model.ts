import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export interface ColumnItem {
  title: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Questionnaire> | null;
  sortDirections: NzTableSortOrder[];
  width?: string;
}
