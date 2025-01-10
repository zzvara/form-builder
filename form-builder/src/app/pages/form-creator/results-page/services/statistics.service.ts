import { Injectable } from '@angular/core';
import { Project } from 'src/app/interfaces/project';
import {instanceOfFormInputData} from "../../../../shared/interfaces/form-input-data";

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  calculateSectionInputStats(project: Project): { [key: string]: number } {
    if (!project?.editList) {
      return {};
    }

    return project.editList.reduce((stats, edit) => {
      if (instanceOfFormInputData(edit.data)) {
        const inputType = edit.data.title;
        if (!stats[inputType]) {
          stats[inputType] = 0;
        }
        stats[inputType]++;
      } else {
        edit.data.sectionInputs.forEach((input) => {
          const inputType = input.title;
          if (!stats[inputType]) {
            stats[inputType] = 0;
          }
          stats[inputType]++;
        });
      }
      return stats;
    }, {} as { [key: string]: number });
  }
}
