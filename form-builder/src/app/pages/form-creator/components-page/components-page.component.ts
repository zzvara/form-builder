import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';

@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrls: ['./components-page.component.less'],
  standalone: false,
})
export class ComponentsPageComponent implements OnInit {
  private readonly projectService: ProjectService<Project> = inject(ProjectService);

  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: string | undefined;
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() versionChange = new EventEmitter<number>();

  inlineEdit: InlineEdit = { enabled: false };

  projectHistory: ProjectVersion<Project>[] = [];
  currentVersionNum?: number;
  tooltipMap: Record<number, string> = {};

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.currentVersionNum = this.projectHistory.length > 0
        ? this.projectHistory[this.projectHistory.length - 1].versionNum
        : 1;

        this.tooltipMap = this.projectHistory.reduce((map, version) => {
          const created = version.created ? new Date(version.created).toLocaleString() : 'N/A';
          map[version.versionNum] = `Created: ${created}`;
          return map;
        }, {} as Record<number, string>);
        

      this.versionChange.emit(this.currentVersionNum);
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

  revertToVersion(versionNum: number): void {
    if (this.projectId !== undefined) {
      const version = this.projectService.revertToVersion(this.projectId, versionNum);
      if (version) {
        this.currentVersionNum = versionNum;
        this.versionChange.emit(this.currentVersionNum);
        this.editComponent.ngOnInit();
      } else {
        console.error('Failed to revert to version', versionNum);
      }
    }
  }
  trackVersion(index: number, version: ProjectVersion<Project>): number {
    return version.versionNum;  
  }

  onSectionInputsChange(undoRedoEvent: 'UNDO' | 'REDO'): void {
    this.editComponent.undoRedo(undoRedoEvent);
  }

  get isNextButtonDisabled(): boolean {
    return this.editComponent ? this.editComponent.isFormInvalid() : true;
  }
}
