import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Questionnaire } from '@interfaces/questionnaire/questionnaire.interface';
import { ProjectType } from '@interfaces/project';
import { ProjectService } from '@services/project.service';
import { ViewType } from '@app/shared/interfaces/view-type.enum';
import { LocalStorageKey } from '@app/shared/constants/localStorage.constant';
import { RoutePath } from '@app/shared/models/route-path.model';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view/list-view.component';
import { CardViewComponent } from './card-view/card-view.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    NzContentComponent,
    NzIconModule,
    NzTooltipModule,
    ListViewComponent,
    CardViewComponent,
    TranslatePipe,
  ],
})
export class DashboardComponent implements OnInit {
  projects$: Observable<Questionnaire[]> = of([]);
  isListView = true;
  projectTypes = ProjectType;

  constructor(
    private readonly router: Router,
    private readonly questionnaireService: ProjectService<Questionnaire>
  ) {}

  ngOnInit(): void {
    this.projects$ = this.questionnaireService.list();
    const savedView = localStorage.getItem(LocalStorageKey.VIEW_PREFERENCE);
    if (savedView) {
      this.isListView = savedView === ViewType.LIST;
    }
  }

  createProject(type: ProjectType): void {
    if (type === ProjectType.TEST) {
      this.router.navigate([RoutePath.NEW], { queryParams: { type: ProjectType.TEST } });
    } else {
      this.router.navigate([RoutePath.NEW], { queryParams: { type: ProjectType.QUESTIONNAIRE } });
    }
  }

  deleteProject(id: string): void {
    this.questionnaireService.remove(id);
  }

  editProject(id: string) {
    this.router.navigate([RoutePath.EDIT], { queryParams: { id } });
  }

  toggleView(): void {
    this.isListView = !this.isListView;
    localStorage.setItem(LocalStorageKey.VIEW_PREFERENCE, this.isListView ? ViewType.LIST : ViewType.CARD);
  }
}
