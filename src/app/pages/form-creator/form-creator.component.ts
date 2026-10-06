import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ProjectType } from '@app/shared/interfaces/project';
import { ViewChild } from '@angular/core';
import { InfoPageComponent } from './info-page/info-page.component';
import { ComponentsPageComponent } from './components-page/components-page.component';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzStepComponent, NzStepsComponent } from 'ng-zorro-antd/steps';
import { TranslatePipe } from '@ngx-translate/core';
import { ResultsPageComponent } from './results-page/results-page.component';

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
export class FormCreatorComponent {
  @ViewChild(InfoPageComponent)
  infoPageComponent?: InfoPageComponent;

  @ViewChild(ComponentsPageComponent)
  componentsPageComponent?: ComponentsPageComponent;

  readonly projectId = signal('');
  readonly currentVersionNum = signal<number | undefined>(undefined);
  readonly projectType = signal(ProjectType.TEST);
  readonly page = signal(0);
  readonly infoValid = signal(false);
  readonly componentValid = signal(false);

  ProjectType = ProjectType;

  checkInfoForm() {
    if (this.infoPageComponent) {
      this.infoValid.set(this.infoPageComponent.form.valid);
    }

    return this.infoValid();
  }

  checkComponentsForm() {
    if (this.componentsPageComponent) {
      this.componentValid.set(!this.componentsPageComponent.editComponent.isFormInvalid());
    }

    return this.componentValid();
  }

  setProjectId(id: string) {
    this.projectId.set(id);
  }

  setVersionNum(versionNum: number) {
    this.currentVersionNum.set(versionNum);
  }

  handleFormData(data: ProjectType) {
    this.projectType.set(data);
  }

  setPage(p: number) {
    if (p <= 2) {
      this.page.set(p);
    }
  }

  nextPage() {
    if (this.page() < 2) {
      this.page.update((page) => page + 1);
    }
  }

  toInfoPage() {
    if (this.page() >= 0) {
      this.page.set(0);
    }
  }

  toCompPage() {
    if (this.page() >= 1 || this.checkInfoForm()) {
      this.infoPageComponent?.submitForm();
      this.page.set(1);
    }
  }

  toAnswPage() {
    if (this.page() >= 2 || (this.checkInfoForm() && this.checkComponentsForm())) {
      this.componentsPageComponent?.saveForm();
      this.page.set(2);
    }
  }
}
