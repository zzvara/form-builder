import { Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';
import { EditList } from '@pages/edit/interfaces/edit-list';
import { instanceOfSectionList } from '@pages/edit/interfaces/section-list';
import { instanceOfFormInputData } from '@interfaces/form-input-data';
import { cloneDeep } from 'lodash-es';

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

  inlineEdit: InlineEdit = { enabled: true };

  projectHistory: ProjectVersion<Project>[] = [];
  currentVersionNum?: number;

  usedComponents: { title: string; id: string; parentId?: string }[] = [];

  /**
   * If a projectId is defined, it fetches the project history and sets the current version number to the latest version.
   * Otherwise, it defaults the current version number to 1.
   * @returns {void}
   */
  ngOnInit(): void {
    if (this.projectId !== undefined) {
      this.projectHistory = this.projectService.getProjectHistory(this.projectId);
      this.currentVersionNum = this.projectHistory.length > 0 ? this.projectHistory[this.projectHistory.length - 1].versionNum : 1;
      this.versionChange.emit(this.currentVersionNum);
    }
  }

  /**
   * Saves the current form state by calling saveForm on the editComponent.
   * Then, it increments the page number and emits an event to notify parent components of the page change.
   */
  nextPage() {
    this.editComponent.saveForm();
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  /**
   * Emits an event to set the current page in the parent component.
   * @param {number} page - The new page number to navigate to.
   * @returns {void}
   */
  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  /**
   * Checks if there is a previous version of the project available.
   * @returns {boolean} True if the current version number is greater than 1, indicating that previous versions exist.
   */
  hasPreviousVersion(): boolean {
    return this.currentVersionNum !== undefined && this.currentVersionNum > 1;
  }

  /**
   * Checks if there is a next version of the project available.
   * @returns {boolean} True if the current version number is not the latest, indicating that a next version exists.
   */
  hasNextVersion(): boolean {
    return this.currentVersionNum !== undefined && this.projectHistory.some((v) => v.versionNum === this.currentVersionNum! + 1);
  }

  /**
   * Navigates to a different version of the project based on the given offset.
   * @param {number} offset - The number to add to the current version number to navigate to the new version.
   * @returns {void}
   */
  navigateVersion(offset: number): void {
    if (this.currentVersionNum !== undefined) {
      const newVersionNum = this.currentVersionNum + offset;
      this.revertToVersion(newVersionNum);
    }
  }

  /**
   * Reverts the project to a specified version.
   * @param versionNum - The version number to revert the project to.
   * @returns {void}
   */
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

  onSectionInputsChange(undoRedoEvent: 'UNDO' | 'REDO'): void {
    this.editComponent.undoRedo(undoRedoEvent);
  }

  get isNextButtonDisabled(): boolean {
    return this.editComponent ? this.editComponent.isFormInvalid() : true;
  }

  onUsedComponentsChange(components: { title: string; id: string; parentId?: string }[]): void {
    this.usedComponents = components;
  }

  onDrop(event: CdkDragDrop<{ title: string; id: string }[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.usedComponents, event.previousIndex, event.currentIndex);
      this.reorderEditListBasedOnUsedComponents();
    }
  }

  private reorderEditListBasedOnUsedComponents(): void {
    const newEditList: EditList[] = [];
    const sectionMap = new Map<string, EditList>();

    for (const component of this.usedComponents) {
      if (!component.parentId) {
        const match = this.editComponent.editList.find((edit) => {
          if (instanceOfSectionList(edit.data)) {
            return edit.data.sectionId === component.id;
          }
          if (instanceOfFormInputData(edit.data)) {
            return edit.data.data?.id === component.id;
          }
          return false;
        });

        if (match) {
          const copy = cloneDeep(match);

          if (instanceOfSectionList(copy.data)) {
            copy.data.sectionInputs = [];
            sectionMap.set(copy.data.sectionId, copy);
          }

          newEditList.push(copy);
        }
      }
    }

    for (const component of this.usedComponents) {
      if (component.parentId) {
        const parent = sectionMap.get(component.parentId);

        if (parent && instanceOfSectionList(parent.data)) {
          const match = this.editComponent.editList
            .flatMap((edit) => (instanceOfSectionList(edit.data) ? edit.data.sectionInputs : []))
            .find((input) => input.data?.id === component.id);

          if (match) {
            parent.data.sectionInputs.push(cloneDeep(match));
          }
        }
      }
    }

    this.editComponent.editList = newEditList;
  }
}
