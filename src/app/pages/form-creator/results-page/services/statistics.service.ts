import { Injectable } from '@angular/core';
import { Project } from '@interfaces/project';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private instanceOfFormInputDataPipe: InstanceOfFormInputDataPipe) {}

  calculateSectionInputStats(project: Project): { [key: string]: number } {
    if (!project?.editList) {
      return {};
    }

    return project.editList.reduce(
      (stats, edit) => {
        if (this.instanceOfFormInputDataPipe.transform(edit.data)) {
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
      },
      {} as { [key: string]: number }
    );
  }
}
