import { Component, ChangeDetectionStrategy, input, output, computed, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { SafeHtmlPipe } from '@app/shared/pipes/safe-html.pipe';
import { ProjectType } from '@interfaces/project';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { TranslatePipe } from '@ngx-translate/core';
import { NzCardComponent, NzCardMetaComponent } from 'ng-zorro-antd/card';
import { NzColDirective, NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzTableModule,
    NzCardComponent,
    NzCardMetaComponent,
    NzTooltipModule,
    NzPopconfirmModule,
    NzColDirective,
    NzGridModule,
    SafeHtmlPipe,
    TranslatePipe,
    DatePipe,
    NzIconModule,
  ],
})
export class CardViewComponent {
  projects = input<Questionnaire[]>([]);
  type = input<ProjectType>();

  deleteProject = output<string>();
  createProject = output<ProjectType>();
  editProject = output<string>();

  projectList = computed(() => {
    const currentType = this.type();
    return this.projects().filter((project) => project.type === currentType);
  });

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
