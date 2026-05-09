import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
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
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-card-view',
  templateUrl: './card-view.component.html',
  styleUrls: ['./card-view.component.less'],
  standalone: true,
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
  encapsulation: ViewEncapsulation.Emulated,
})
export class CardViewComponent implements OnInit {
  @Input() projects: Observable<Questionnaire[]> = of([]);
  @Input() type?: ProjectType;

  @Output() deleteProject = new EventEmitter<string>();
  @Output() createProject = new EventEmitter<ProjectType>();
  @Output() editProject = new EventEmitter<string>();

  projectList: Questionnaire[] = [];

  DateFormat = DateFormat;

  ngOnInit(): void {
    this.projects.subscribe(
      (projects) => (this.projectList = projects.filter((project) => project.type === this.type)),
    );
  }

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
