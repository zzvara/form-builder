import { Injectable } from '@angular/core';
import { Project } from 'src/app/interfaces/project';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  calculateSectionInputStats(project: Project): { [key: string]: number } {
    if (!project?.sectionList) {
      return {};
    }

    return project.sectionList.reduce((stats, section) => {
      section.sectionInputs.forEach((input) => {
        const inputType = input.title;
        if (!stats[inputType]) {
          stats[inputType] = 0;
        }
        stats[inputType]++;
      });
      return stats;
    }, {} as { [key: string]: number });
  }
}
