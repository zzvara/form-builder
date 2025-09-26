import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { TranslateService } from '@ngx-translate/core';

interface DiffItem {
  key: string;
  before: string;
  after: string;
}
@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrls: ['./components-page.component.less'],
  standalone: false,
})
export class ComponentsPageComponent implements OnInit {
  private readonly modal = inject(NzModalService);
  private readonly translate = inject(TranslateService);
  private readonly projectService: ProjectService<Project> = inject(ProjectService);

  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: string | undefined;
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() versionChange = new EventEmitter<number>();

  inlineEdit: InlineEdit = { enabled: true };

  projectHistory: ProjectVersion<Project>[] = [];
  currentVersionNum?: number;

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
  trackByVersion(index: number, version: ProjectVersion<Project>): number {
    return version.versionNum; // Track by the version number
  }

  selectVersion(versionNum: number) {
    this.revertToVersion(versionNum);
  }

  getDiffItems(version: ProjectVersion<Project>): DiffItem[] {
    const prev = this.projectHistory.find((v) => v.versionNum === version.versionNum - 1);
    if (!prev) return [];

    const curr = version.project;
    const old = prev.project;
    const keys = Object.keys(curr) as Array<keyof Project>;

    return keys
      .filter((key) => JSON.stringify(curr[key]) !== JSON.stringify(old[key]))
      .map((key) => ({
        key: key,
        before: JSON.stringify(old[key]),
        after: JSON.stringify(curr[key]),
      }));
  }
  public getChangeItemsForVersion(version: ProjectVersion<Project>): Array<{ key: string; before: any; after: any }> {
    return this.getDiffItems(version).map((d) => ({ key: d.key, before: d.before, after: d.after }));
  }
  openDiffModal(version: ProjectVersion<Project>): void {
    const prev = version.versionNum - 1;
    const title =
      prev > 0
        ? this.translate.instant('COMPONENTS.CHANGE_SUMMARY.CHANGES_SINCE', { version: prev })
        : this.translate.instant('COMPONENTS.CHANGE_SUMMARY.CHANGES_SINCE', { version: version.versionNum });

    this.modal.create({
      nzTitle: title,
      nzContent: ChangeSummaryComponent,
      nzData: { items: this.getChangeItemsForVersion(version) },
      nzWidth: '60vw',
      nzCentered: true,
      nzFooter: null,
    });
  }

  onSectionInputsChange(undoRedoEvent: 'UNDO' | 'REDO'): void {
    this.editComponent.undoRedo(undoRedoEvent);
  }

  get isNextButtonDisabled(): boolean {
    return this.editComponent ? this.editComponent.isFormInvalid() : true;
  }
}
