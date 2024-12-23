import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';
import { Questionnaire } from 'src/app/interfaces/questionnaire/questionnaire.interface';

export interface ColumnItem {
  title: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Questionnaire> | null;
  sortDirections: NzTableSortOrder[];
}
