import { Component, OnInit, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

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
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    NzContentComponent,
    NzIconModule,
    NzTooltipModule,
    NzButtonModule,
    ListViewComponent,
    CardViewComponent,
    TranslatePipe,
  ],
})
export class DashboardComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly questionnaireService = inject(ProjectService<Questionnaire>);

  projects = this.questionnaireService.list();
  isListView = signal(true);
  projectTypes = ProjectType;

  ngOnInit(): void {
    const savedView = localStorage.getItem(LocalStorageKey.VIEW_PREFERENCE);
    if (savedView) {
      this.isListView.set(savedView === ViewType.LIST);
    }
  }

  createProject(type: ProjectType): void {
    this.router.navigate([RoutePath.NEW], { queryParams: { type } });
  }

  deleteProject(id: string): void {
    this.questionnaireService.remove(id);
  }

  editProject(id: string) {
    this.router.navigate([RoutePath.EDIT], { queryParams: { id } });
  }

  toggleView(): void {
    this.isListView.update(v => !v);
    localStorage.setItem(
      LocalStorageKey.VIEW_PREFERENCE,
      this.isListView() ? ViewType.LIST : ViewType.CARD,
    );
  }
}
