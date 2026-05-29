import { ChangeDetectorRef, Component } from '@angular/core';
import { ProjectType } from '@app/shared/interfaces/project';
import { FormBuilderStore } from '@app/core/form-builder.store';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.less'],
  standalone: false,
})
export class FormCreatorComponent {
  ProjectType = ProjectType;

  constructor(public store: FormBuilderStore) {}

  toInfoPage() {
    this.store.setPageStep(0);
  }

  toCompPage() {
    if (this.store.currentStep() >= 1 || this.store.isInfoValid()) {
      this.store.saveProject();
      this.store.setPageStep(1);
    }
  }

  toAnswPage() {
    if (this.store.currentStep() >= 2 || (this.store.isInfoValid() && this.store.isComponentsValid())) {
      this.store.saveProject();
      this.store.setPageStep(2);
    }
  }
}
