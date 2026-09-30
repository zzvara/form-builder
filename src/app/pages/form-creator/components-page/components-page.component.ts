import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { DatePipe } from '@angular/common';
import { RedoUndoComponent } from '@app/shared/components/redo-undo/redo-undo.component';
import { FormsModule } from '@angular/forms';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

interface DiffItem {
  key: string;
  before: string;
  after: string;
}
@Component({
  selector: 'app-components-page',
  templateUrl: './components-page.component.html',
  styleUrls: ['./components-page.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NzLayoutComponent,
    EditComponent,
    NzTooltipModule,
    NzDropdownModule,
    DatePipe,
    RedoUndoComponent,
    NzButtonComponent,
    NzCheckboxComponent,
    NzIconModule,
    NzMenuModule,
    NzPopoverModule,
    TranslatePipe,
  ],
})
export class ComponentsPageComponent implements OnInit {
  readonly editComponent = viewChild(EditComponent);

  readonly projectId = input<string>();
  readonly page = input<number>();
  readonly setPage = output<number>();
  readonly versionChange = output<number>();

  readonly inlineEdit = signal<InlineEdit>({ enabled: true });

  readonly projectHistory = signal<ProjectVersion<Project>[]>([]);
  readonly currentVersionNum = signal<number | undefined>(undefined);

  DateFormat = DateFormat;

  constructor(
    private modal: NzModalService,
    private translate: TranslateService,
    private projectService: ProjectService<Project>,
  ) {}

  /**
   * If a projectId is defined, it fetches the project history and sets the current version number to the latest version.
   * Otherwise, it defaults the current version number to 1.
   * @returns {void}
   */
  ngOnInit(): void {
    const projectId = this.projectId();
    if (projectId !== undefined) {
      const projectHistory = this.projectService.getProjectHistory(projectId);
      this.projectHistory.set(projectHistory);

      this.currentVersionNum.set(
        projectHistory.length > 0 ? projectHistory[projectHistory.length - 1].versionNum : 1,
      );
      this.versionChange.emit(this.currentVersionNum()!);
    }
  }

  /**
   * Saves the current form state by calling saveForm on the editComponent.
   * Then, it increments the page number and emits an event to notify parent components of the page change.
   */
  nextPage() {
    const saved = this.saveForm();
    if (saved) {
      this.onsetPage(this.page()! + 1);
    }
  }

  saveForm(): boolean {
    const editComponent = this.editComponent();
    if (!editComponent) return false;

    if (editComponent.isFormInvalid()) {
      this.jumpToFirstError();
      return false;
    }
    editComponent.saveForm();
    return true;
  }

  jumpToFirstError() {
    const editComponent = this.editComponent();
    if (!editComponent) return;

    const invalidInput = editComponent
      .getAllFormInputs()
      .find((inp) => editComponent.isInputInvalid(inp));

    if (invalidInput?.data?.id) {
      editComponent.scrollToElement(invalidInput.data.id);
      return;
    }

    const invalidRepeatedSection = editComponent
      .editList()
      .find((item) => editComponent.hasRepeatedSettingsErrorForEdit(item));

    if (invalidRepeatedSection?.id) {
      editComponent.scrollToElement(invalidRepeatedSection.id);
      return;
    }

    const invalidSection = editComponent
      .editList()
      .find((item) => editComponent.isComponentInvalid(item));

    if (invalidSection?.id) {
      editComponent.scrollToElement(invalidSection.id);
      return;
    }
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
    const currentVersionNum = this.currentVersionNum();
    return currentVersionNum !== undefined && currentVersionNum > 1;
  }

  /**
   * Checks if there is a next version of the project available.
   * @returns {boolean} True if the current version number is not the latest, indicating that a next version exists.
   */
  hasNextVersion(): boolean {
    const currentVersionNum = this.currentVersionNum();
    return (
      currentVersionNum !== undefined &&
      this.projectHistory().some((v) => v.versionNum === currentVersionNum + 1)
    );
  }

  /**
   * Navigates to a different version of the project based on the given offset.
   * @param {number} offset - The number to add to the current version number to navigate to the new version.
   * @returns {void}
   */
  navigateVersion(offset: number): void {
    const currentVersionNum = this.currentVersionNum();
    if (currentVersionNum !== undefined) {
      const newVersionNum = currentVersionNum + offset;
      this.revertToVersion(newVersionNum);
    }
  }

  /**
   * Reverts the project to a specified version.
   * @param versionNum - The version number to revert the project to.
   * @returns {void}
   */
  revertToVersion(versionNum: number): void {
    const projectId = this.projectId();
    if (projectId !== undefined) {
      const version = this.projectService.revertToVersion(projectId, versionNum);
      if (version) {
        this.currentVersionNum.set(versionNum);
        this.versionChange.emit(versionNum);
        this.editComponent()?.reload();
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
    const prev = this.projectHistory().find((v) => v.versionNum === version.versionNum - 1);
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
  public getChangeItemsForVersion(
    version: ProjectVersion<Project>,
  ): Array<{ key: string; before: any; after: any }> {
    return this.getDiffItems(version).map((d) => ({
      key: d.key,
      before: d.before,
      after: d.after,
    }));
  }
  openDiffModal(version: ProjectVersion<Project>): void {
    const prev = version.versionNum - 1;
    const title =
      prev > 0
        ? this.translate.instant('COMPONENTS.CHANGE_SUMMARY.CHANGES_SINCE', { version: prev })
        : this.translate.instant('COMPONENTS.CHANGE_SUMMARY.CHANGES_SINCE', {
            version: version.versionNum,
          });

    this.modal.create({
      nzTitle: title,
      nzContent: ChangeSummaryComponent,
      nzData: { items: this.getChangeItemsForVersion(version) },
      nzWidth: '60vw',
      nzCentered: true,
      nzFooter: null,
    });
  }

  onSectionInputsChange(undoRedoEvent: UndoRedoEnum): void {
    this.editComponent()?.undoRedo(undoRedoEvent);
  }

  onInlineEditChange(enabled: boolean): void {
    this.inlineEdit.set({ enabled });
  }

  get isNextButtonDisabled(): boolean {
    const editComponent = this.editComponent();
    return editComponent ? editComponent.isFormInvalid() : true;
  }
}
