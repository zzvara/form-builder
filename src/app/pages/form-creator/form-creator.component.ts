import { ChangeDetectorRef, Component } from '@angular/core';
import { ProjectType } from '@app/shared/interfaces/project';
import { ViewChild } from '@angular/core';
import { InfoPageComponent } from './info-page/info-page.component';
import { ComponentsPageComponent } from './components-page/components-page.component';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.less'],
  standalone: false,
})
export class FormCreatorComponent {

  @ViewChild(InfoPageComponent)
  infoPageComponent?: InfoPageComponent;

  @ViewChild(ComponentsPageComponent)
  componentsPageComponent?: ComponentsPageComponent;

  projectId: string = '';
  currentVersionNum?: number;
  projectType: ProjectType = ProjectType.TEST;
  page = 0;
  infoValid = false;
  componentValid = false;

  ProjectType = ProjectType;

  constructor(private readonly cdr: ChangeDetectorRef) {}

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
      this.page = p;
    }
  }

  nextPage() {
    if (this.page < 2) {
      this.page += 1;
    }
  }

  toInfoPage() {
    if (this.page >= 0) {
      this.page = 0;
    }
  }

  toCompPage() {
    if (this.page >= 1 || this.checkInfoForm()) {
      this.infoPageComponent?.submitForm();
      this.page = 1;
    }
  }

  toAnswPage() {
    if (this.page >= 2 || (this.checkInfoForm() && this.checkComponentsForm())) {
      this.componentsPageComponent?.saveForm();
      this.page = 2;
    }
  }
}
