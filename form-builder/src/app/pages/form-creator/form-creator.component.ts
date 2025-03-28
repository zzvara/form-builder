import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.less'],
  standalone: false,
})
export class FormCreatorComponent {
  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.projectId = '';
  }

  projectId: string;
  currentVersionNum?: number;
  projectType: string = '';

  setProjectId(id: string) {
    this.projectId = id;
  }

  setVersionNum(versionNum: number) {
    this.currentVersionNum = versionNum;
  }

  handleFormData(data: string) {
    this.projectType = data;
    this.cdr.detectChanges();

    console.log('Project type:', this.projectType);
  }

  page = 0;

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
    if (this.page >= 1) {
      this.page = 1;
    }
  }
  toAnswPage() {
    if (this.page >= 2) {
      this.page = 2;
    }
  }
}
