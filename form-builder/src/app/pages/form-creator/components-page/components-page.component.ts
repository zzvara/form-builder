import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EditComponent } from '../../edit/edit.component';
import { Project } from 'src/app/items/project.interface';
import { ProjectService, ProjectVersion } from 'src/app/services/project.service';

@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrls: ['./components-page.component.css'],
})
export class ComponentsPageComponent implements OnInit {
  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: number | undefined;

  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();

  projectHistory: ProjectVersion<Project>[] = [];
  currentVersionNum?: number;

  constructor(private projectService: ProjectService<Project>) {}

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.currentVersionNum = this.projectHistory.length > 0 ? this.projectHistory[this.projectHistory.length - 1].versionNum : 1;
      // console.log('projectHistory', this.projectHistory);
    }
  }

  nextPage() {
    this.editComponent.saveForm();
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  hasPreviousVersion(): boolean {
    return this.currentVersionNum !== undefined && this.currentVersionNum > 1;
  }

  hasNextVersion(): boolean {
    return this.currentVersionNum !== undefined && this.projectHistory.some((v) => v.versionNum === this.currentVersionNum! + 1);
  }

  navigateVersion(offset: number): void {
    if (this.currentVersionNum !== undefined) {
      const newVersionNum = this.currentVersionNum + offset;
      this.revertToVersion(newVersionNum);
    }
  }

  onVersionSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedVersionNum = parseInt(selectElement.value, 10);
    this.revertToVersion(selectedVersionNum);
  }

  revertToVersion(versionNum: number) {
    if (this.projectId !== undefined) {
      const version = this.projectService.revertToVersion(this.projectId, versionNum);
      if (version) {
        this.currentVersionNum = versionNum;
        this.editComponent.ngOnInit();
      } else {
        console.error('Failed to revert to version', versionNum);
      }
    }
  }
}
