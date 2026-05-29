import { ChangeDetectorRef, Component } from '@angular/core';
import { ProjectType } from '@app/shared/interfaces/project';
import { ViewChild } from '@angular/core';
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

  projectId: string = '';
  currentVersionNum?: number;
  projectType: ProjectType = ProjectType.TEST;
  infoValid = false;
  componentValid = false;

  ProjectType = ProjectType;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    public store: FormBuilderStore
  ) {}

  checkInfoForm() {
    if (this.infoPageComponent) {
      this.infoValid = this.infoPageComponent.form.valid;
    }

    return this.infoValid;
  }

  checkComponentsForm() {
    if (this.componentsPageComponent) {
      this.componentValid = !this.componentsPageComponent.editComponent.isFormInvalid();
    }

    return this.componentValid;
  }

  setProjectId(id: string) {
    this.projectId = id;
  }

  setVersionNum(versionNum: number) {
    this.currentVersionNum = versionNum;
  }

  handleFormData(data: ProjectType) {
    this.projectType = data;
    this.cdr.detectChanges();
  }

  setPage(p: number) {
    if (p <= 2) {
      this.store.setStep(p);
    }
  }

  nextPage() {
    if (this.store.currentStep() < 2) {
      this.store.setStep(this.store.currentStep() + 1);
    }
  }

  toInfoPage() {
    this.store.setStep(0);
  }

  toCompPage() {
    if (this.store.currentStep() >= 1 || this.checkInfoForm()) {
      this.infoPageComponent?.submitForm();
      this.store.saveProject();
      this.store.setStep(1);
    }
  }

  toAnswPage() {
    if (this.store.currentStep() >= 2 || (this.checkInfoForm() && this.checkComponentsForm())) {
      this.componentsPageComponent?.saveForm();
      this.store.saveProject();
      this.store.setStep(2);
    }
  }
}
