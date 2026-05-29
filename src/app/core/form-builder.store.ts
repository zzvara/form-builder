import { Injectable, signal, computed, inject } from '@angular/core';
import { Project, ProjectType } from '@app/shared/interfaces/project';
import { ProjectService } from '@app/shared/services/project.service';
import { INITIAL_FORM } from '@app/shared/constants/store.constant';
import { UndoRedoService } from '@app/shared/services/undo-redo.service';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

/**
 * Store for managing the form builder state, including project data,
 * navigation between creation steps, versioning, and undo-redo history.
 */
@Injectable({ providedIn: 'root' })
export class FormBuilderStore {
  private readonly projectService = inject(ProjectService<Project>);
  private readonly undoRedoService = inject(UndoRedoService<EditList[]>);
  private readonly message = inject(NzMessageService);
  private readonly translate = inject(TranslateService);

  historyRestored = signal<number>(0);
  currentStep = signal<number>(0);

  project = signal<Project | null>(null);
  projectId = computed(() => this.project()?.id ?? '');
  currentVersion = signal<number | undefined>(undefined);
  isComponentsFormValid = signal<boolean>(false);

  // Page validity

  /**
   * Computed signal to check if the "Form Info" page is valid.
   * @returns {boolean} True if valid.
   */
  isInfoValid = computed(() => {
    const project = this.project();
    return project?.title && project?.type;
  });

  /**
   * Computed signal to check if the "Components" page is valid.
   * @returns {boolean} True if the components are valid.
   */
  isComponentsValid = computed(() => {
    const project = this.project();
    return (project?.editList?.length ?? 0) > 0 && this.isComponentsFormValid();
  });

  // Navigating through pages

  /**
   * Computed signal determining if the user can proceed to the next page.
   * @returns {boolean} True if it is allowed to go to the next page.
   */
  canGoNextPage = computed(() => {
    const step = this.currentStep();
    if (step === 0) return this.isInfoValid();
    if (step === 1) return this.isComponentsValid();
    return true;
  });

  /**
   * Sets the current page step.
   * @param {number} step - The step number to navigate to (there are only 3 pages).
   */
  setPageStep(step: number) {
    if (step < 0 || step > 2) return;
    this.currentStep.set(step);
  }

  /**
   * Navigates to the next page if valid.
   */
  nextPage() {
    const current = this.currentStep();
    if (current < 2 && this.canGoNextPage()) this.currentStep.set(current + 1);
  }

  /**
   * Navigates to the previous page.
   */
  previousPage() {
    const current = this.currentStep();
    if (current > 0) this.currentStep.set(current - 1);
  }

  // Project handling

  /**
   * Loads a project by ID from the project service.
   * @param {string} projectId - The ID of the project to load.
   * @returns {boolean} True if the project was successfully loaded.
   */
  private loadProject(projectId: string): boolean {
    const projects = this.projectService.searchData(projectId);

    if (projects.length > 0) {
      this.project.set(projects[0]);
      return true;
    }

    return false;
  }

  /**
   * Initializes a new project with the given type.
   * @param {ProjectType} type - The type of the new project.
   */
  initNewProject(type: ProjectType) {
    this.currentStep.set(0);
    this.currentVersion.set(undefined);
    this.isComponentsFormValid.set(false);
    this.project.set({ ...INITIAL_FORM, type, id: '' });
    this.clearEditHistory();
  }

  /**
   * Sets the active project by loading it from the local storage. If the project is not found, then a message appears and the user is navigated to the "Info Page" of a new project.
   * @param {string} projectId - The ID of the project to set.
   */
  setProject(projectId: string) {
    const success = this.loadProject(projectId);
    if (success) {
      this.currentStep.set(0);
      this.currentVersion.set(undefined);
      this.isComponentsFormValid.set(this.project()?.isComponentsValid ?? false);
      this.clearEditHistory();
      const initialEditList = this.project()?.editList ?? [];
      this.saveEditHistory(initialEditList);
    } else {
      this.translate.get('ERRORS.PROJECT_NOT_FOUND').subscribe((res: string) => {
        this.message.error(res);
      });
    }
  }

  /**
   * Updates the current project with partial data.
   * @param {Partial<Project>} data - The data to merge into the project.
   */
  updateProject(data: Partial<Project>) {
    this.project.update((proj) => (proj ? { ...proj, ...data } : proj));
  }

  /**
   * Saves the current project state to the storage.
   */
  saveProject() {
    const project = this.project();
    if (!project) return;

    if (!project.id || project.id === '') {
      this.projectService.add(project);
      this.project.set(project);
    } else {
      this.projectService.update(project.id, project);
    }
  }

  // Versioning

  /**
   * Initializes the version number signal without reverting the project.
   * @param {number | undefined} versionNum - The version number to initialize.
   */
  initVersionNumber(versionNum: number | undefined) {
    if (!versionNum) return;
    this.currentVersion.set(versionNum);
  }

  /**
   * Sets the active version number and reverts the project to that version.
   * @param {number | undefined} versionNum - The version number to set and revert to.
   */
  setVersion(versionNum: number | undefined) {
    if (!versionNum) return;

    this.currentVersion.set(versionNum);
    this.changeProjectVersion(versionNum);
  }

  /**
   * Reverts the project to a specific version number.
   * @param {number | undefined} versionNum - The version number.
   */
  private changeProjectVersion(versionNum: number | undefined) {
    if (this.project()?.id && versionNum) {
      const version = this.projectService.revertToVersion(this.project()!.id, versionNum);
      if (version) {
        this.loadProject(this.projectId());
      } else {
        console.error('Failed to revert to version', versionNum);
      }
    }
  }

  // Undo-redo

  /**
   * Saves the edit history state.
   * @param {EditList[]} state - The list of edit states to save.
   */
  saveEditHistory(state: EditList[]) {
    this.undoRedoService.saveState(state);
  }

  /**
   * Undoes the last edit and updates the project state.
   */
  undoEdit() {
    const restored = this.undoRedoService.undo();
    if (restored) {
      this.updateProject({ editList: restored });
      this.historyRestored.set(Date.now());
    }
  }

  /**
   * Redoes the last undone edit and updates the project state.
   */
  redoEdit() {
    const restored = this.undoRedoService.redo();
    if (restored) {
      this.updateProject({ editList: restored });
      this.historyRestored.set(Date.now());
    }
  }

  /**
   * Clears the undo/redo history.
   */
  clearEditHistory() {
    this.undoRedoService.clearHistory();
  }
}
