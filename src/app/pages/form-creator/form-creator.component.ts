import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { ProjectType } from '@app/shared/interfaces/project';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { InfoPageComponent } from './info-page/info-page.component';
import { ComponentsPageComponent } from './components-page/components-page.component';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzStepComponent, NzStepsComponent } from 'ng-zorro-antd/steps';
import { TranslatePipe } from '@ngx-translate/core';
import { ResultsPageComponent } from './results-page/results-page.component';
import { FormBuilderStore } from '@app/core/form-builder.store';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NzLayoutComponent,
    NzStepComponent,
    NzStepsComponent,
    TranslatePipe,
    InfoPageComponent,
    ComponentsPageComponent,
    ResultsPageComponent,
  ],
})
export class FormCreatorComponent implements OnInit {
  ProjectType = ProjectType;
  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    public store: FormBuilderStore
  ) {}

  ngOnInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      if (!params['id']) {
        const type = params['type'] === ProjectType.TEST ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
        this.store.initNewProject(type);
      }
    });
  }

  toInfoPage() {
    this.store.setPageStep(0);
  }

  toCompPage() {
    if (this.store.currentStep() >= 1) {
      this.store.setPageStep(1);
    } else if (this.store.canGoNextPage()) {
      this.store.saveProject();
      this.store.nextPage();
    }
  }

  toAnswPage() {
    if (this.store.currentStep() >= 2) {
      this.store.setPageStep(2);
    } else if (this.store.isInfoValid() && this.store.isComponentsValid()) {
      this.store.saveProject();
      this.store.setPageStep(2);
    }
  }
}
