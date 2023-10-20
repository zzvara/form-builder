import { NzTableSortFn, NzTableSortOrder } from 'ng-zorro-antd/table';

export enum ProjectType {
  QUESTIONNAIRE = 'questionnaire',
  TEST = 'test',
}

export interface Project {
  name: string;
  created: string;
  modified: string;
  type: ProjectType;
}

export interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<Project> | null;
  sortDirections: NzTableSortOrder[];
}
