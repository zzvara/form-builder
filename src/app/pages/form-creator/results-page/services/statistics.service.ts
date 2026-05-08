import { Injectable, inject } from '@angular/core';
import type { Project } from '@interfaces/project';
import type { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private instanceOfFormInputDataPipe = inject(InstanceOfFormInputDataPipe);

  calculateSectionInputStats(project: Project): Record<string, number> {
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
      {} as Record<string, number>,
    );
  }
}
