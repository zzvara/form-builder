import { Component, ChangeDetectionStrategy, input, output, computed, ViewEncapsulation } from '@angular/core';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { ProjectType } from '@interfaces/project';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
  standalone: false,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush, // <-- OnPush!
})
export class CardViewComponent {

  projects = input<Questionnaire[]>([]);
  type = input<ProjectType>();

  deleteProject = output<string>();
  createProject = output<ProjectType>();
  editProject = output<string>();
  projectList = computed(() => this.projects().filter((project) => project.type === this.type()));

  DateFormat = DateFormat;

  onDeleteProject(id: string): void {
    this.deleteProject.emit(id);
  }

  onCreateProject(type: ProjectType): void {
    this.createProject.emit(type);
  }

  onEditProject(id: string): void {
    this.editProject.emit(id);
  }
}
