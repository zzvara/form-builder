import { Injectable, signal, computed, inject } from '@angular/core';
import { Project, ProjectType } from '@app/shared/interfaces/project';
import { ProjectService } from '@app/shared/services/project.service';
import { INITIAL_FORM } from '@app/shared/constants/store.constant';
import { UndoRedoService } from '@app/shared/services/undo-redo.service';
import { EditList } from '@app/pages/edit/interfaces/edit-list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateService } from '@ngx-translate/core';

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

  isInfoValid = computed(() => {
    const project = this.project();
    return project?.title && project?.type;
  });

  isComponentsValid = computed(() => {
    const project = this.project();
    return (project?.editList?.length ?? 0) > 0 && this.isComponentsFormValid();
  });

  canGoNext = computed(() => {
    const step = this.currentStep();
    if (step === 0) return this.isInfoValid();
    if (step === 1) return this.isComponentsValid();
    return true;
  });

  setStep(step: number) {
    if (step < 0 || step > 2) return;
    this.currentStep.set(step);
  }

  next() {
    const current = this.currentStep();
    if (current < 2 && this.canGoNext()) this.currentStep.set(current + 1);
  }

  prev() {
    const current = this.currentStep();
    if (current > 0) this.currentStep.set(current - 1);
  }

  private loadProject(projectId: string): boolean {
    const projects = this.projectService.searchData(projectId);

    if (projects.length > 0) {
      this.project.set(projects[0]);
      return true;
    }

    return false;
  }

  initNewProject(type: ProjectType) {
    this.currentStep.set(0);
    this.currentVersion.set(undefined);
    this.isComponentsFormValid.set(false);
    this.project.set({ ...INITIAL_FORM, type, id: '' });
    this.clearHistory();
  }

  setProject(projectId: string) {
    const success = this.loadProject(projectId);
    if (success) {
      this.currentStep.set(0);
      this.currentVersion.set(undefined);
      this.isComponentsFormValid.set(this.project()?.isComponentsValid ?? false);
      this.clearHistory();
      const initialEditList = this.project()?.editList ?? [];
      this.saveEditHistory(initialEditList);
    } else {
      this.translate.get('ERRORS.PROJECT_NOT_FOUND').subscribe((res: string) => {
      this.message.error(res);
    });
    }
  }

  updateProject(data: Partial<Project>) {
    this.project.update((proj) => (proj ? { ...proj, ...data } : proj));
  }

  initVersionNumber(versionNum: number | undefined) {
    if (!versionNum) return;
    this.currentVersion.set(versionNum);
  }

  setVersion(versionNum: number | undefined) {
    if (!versionNum) return;

    this.currentVersion.set(versionNum);
    this.changeProjectVersion(versionNum);
  }

  changeProjectVersion(versionNum: number | undefined) {
    if (this.project()?.id && versionNum) {
      const version = this.projectService.revertToVersion(this.project()!.id, versionNum);
      if (version) {
        this.loadProject(this.projectId());
      } else {
        console.error('Failed to revert to version', versionNum);
      }
    }
  }

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

  saveEditHistory(state: EditList[]) {
    this.undoRedoService.saveState(state);
  }

  undoEdit() {
    const restored = this.undoRedoService.undo();
    if (restored) {
      this.updateProject({ editList: restored });
      this.historyRestored.set(Date.now());
    }
  }

  redoEdit() {
    const restored = this.undoRedoService.redo();
    if (restored) {
      this.updateProject({ editList: restored });
      this.historyRestored.set(Date.now());
    }
  }

  clearHistory() {
    this.undoRedoService.clearHistory();
  }
}
