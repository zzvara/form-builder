import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, signal, Signal, computed } from '@angular/core';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { TranslateService } from '@ngx-translate/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { DateFormat } from '@app/shared/constants/date-format.constant';

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
  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: string | undefined;
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() versionChange = new EventEmitter<number>();

  private readonly _inlineEdit = signal<InlineEdit>({ enabled: true });
  public readonly inlineEdit: Signal<InlineEdit> = this._inlineEdit.asReadonly();

  private readonly _projectHistory = signal<ProjectVersion<Project>[]>([]);
  public readonly projectHistory: Signal<ProjectVersion<Project>[]> = this._projectHistory.asReadonly();

  private readonly _currentVersionNum = signal<number | undefined>(undefined);
  public readonly currentVersionNum: Signal<number | undefined> = this._currentVersionNum.asReadonly();

  public readonly hasPreviousVersion = computed(() => {
    const current = this._currentVersionNum();
    return current !== undefined && current > 1;
  });

  public readonly hasNextVersion = computed(() => {
    const current = this._currentVersionNum();
    const history = this._projectHistory();
    return current !== undefined && history.some((v) => v.versionNum === current + 1);
  });

  DateFormat = DateFormat;

  constructor(
    private modal: NzModalService,
    private translate: TranslateService,
    private projectService: ProjectService<Project>,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.projectId !== undefined) {
      const history = this.projectService.getProjectHistory(this.projectId);
      this._projectHistory.set(history);

      const latestVersionNum = history.length > 0 ? history[history.length - 1].versionNum : 1;
      this._currentVersionNum.set(latestVersionNum);

      this.versionChange.emit(this._currentVersionNum());
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  nextPage() {
    this.saveForm();
    if (this.page !== undefined) {
      this.page += 1;
      this.onsetPage(this.page);
    }
  }

  saveForm() {
    if (!this.editComponent) return;

    if (this.editComponent.isFormInvalid()) {
      this.jumpToFirstError();
      return;
    }
    this.editComponent.saveForm();
  }

  jumpToFirstError() {
    if (!this.editComponent) return;

    const invalidInput = this.editComponent.getAllFormInputs().find((inp) => this.editComponent.isInputInvalid(inp));

    if (invalidInput?.data?.id) {
      this.editComponent.scrollToElement(invalidInput.data.id);
      return;
    }

      const invalidSection = this.editComponent.editList().find((item) => this.editComponent.isComponentInvalid(item));

    if (invalidSection?.id) {
      this.editComponent.scrollToElement(invalidSection.id);
      return;
    }
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  navigateVersion(offset: number): void {
    const current = this._currentVersionNum();
    if (current !== undefined) {
      const newVersionNum = current + offset;
      this.revertToVersion(newVersionNum);
    }
  }

  revertToVersion(versionNum: number): void {
    if (this.projectId !== undefined) {
      const version = this.projectService.revertToVersion(this.projectId, versionNum);
      if (version) {
        this._currentVersionNum.set(versionNum);
        this.versionChange.emit(this._currentVersionNum());
        this.editComponent.ngOnInit();
      } else {
        console.error('Failed to revert to version', versionNum);
      }
    }
  }

  trackByVersion(index: number, version: ProjectVersion<Project>): number {
    return version.versionNum;
  }

  selectVersion(versionNum: number) {
    this.revertToVersion(versionNum);
  }

  getDiffItems(version: ProjectVersion<Project>): DiffItem[] {
    const history = this._projectHistory();
    const prev = history.find((v) => v.versionNum === version.versionNum - 1);
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

  onSectionInputsChange(undoRedoEvent: UndoRedoEnum): void {
    this.editComponent.undoRedo(undoRedoEvent);
  }

  get isNextButtonDisabled(): boolean {
    return this.editComponent ? this.editComponent.isFormInvalid() : true;
  }

  onInlineEditChange(enabled: boolean): void {
    this._inlineEdit.update(state => ({ ...state, enabled }));
  }
}
