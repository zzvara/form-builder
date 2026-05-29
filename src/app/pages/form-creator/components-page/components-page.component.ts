import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, signal, Signal, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project, ProjectVersion } from '@interfaces/project';
import { EditComponent } from '@pages/edit/edit.component';
import { ProjectService } from '@services/project.service';
import { InlineEdit } from '@interfaces/inline-edit';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ChangeSummaryComponent } from './change-summary/change-summary.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { DateFormat } from '@app/shared/constants/date-format.constant';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { RedoUndoComponent } from '@app/shared/components/redo-undo/redo-undo.component';
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
  @ViewChild(EditComponent) editComponent!: EditComponent;

  @Input() projectId: string | undefined;
  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();
  @Output() versionChange = new EventEmitter<number>();

  private readonly _inlineEdit = signal<InlineEdit>({ enabled: true });
  public readonly inlineEdit: Signal<InlineEdit> = this._inlineEdit.asReadonly();

  private readonly _projectHistory = signal<ProjectVersion<Project>[]>([]);
  public readonly projectHistory: Signal<ProjectVersion<Project>[]> = this._projectHistory.asReadonly();

  public readonly hasPreviousVersion = computed(() => {
    const current = this.store.currentVersion();
    return current !== undefined && current > 1;
  });

  public readonly hasNextVersion = computed(() => {
    const current = this.store.currentVersion();
    const history = this._projectHistory();
    return current !== undefined && history.some((v) => v.versionNum === current + 1);
  });

  DateFormat = DateFormat;

  constructor(
    private modal: NzModalService,
    private translate: TranslateService,
    private projectService: ProjectService<Project>,
    public store: FormBuilderStore,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.projectId || this.store.projectId();
    if (id) {
      const history = this.projectService.getProjectHistory(id);
      this._projectHistory.set(history);

      const latestVersionNum = history.length > 0 ? history[history.length - 1].versionNum : 1;
      this.store.initVersionNumber(latestVersionNum);
      this.versionChange.emit(this.store.currentVersion());
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  nextPage() {
    this.store.saveProject();
    if (this.page !== undefined) {
      this.page += 1;
      this.onsetPage(this.page);
    }
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }

  navigateVersion(offset: number): void {
    const current = this.store.currentVersion();
    if (current !== undefined) {
      const newVersionNum = current + offset;
      this.store.setVersion(newVersionNum);
      this.versionChange.emit(this.store.currentVersion());
    }
  }

  trackByVersion(index: number, version: ProjectVersion<Project>): number {
    return version.versionNum;
  }

  selectVersion(versionNum: number) {
    this.store.setVersion(versionNum);
    this.versionChange.emit(this.store.currentVersion());
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

  public getChangeItemsForVersion(
    version: ProjectVersion<Project>
  ): Array<{ key: string; before: any; after: any }> {
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
    if (undoRedoEvent === UndoRedoEnum.UNDO) {
      this.store.undoEdit();
    } else {
      this.store.redoEdit();
    }
  }

  get isNextButtonDisabled(): boolean {
    return !this.store.isComponentsValid();
  }

  onInlineEditChange(enabled: boolean): void {
    this._inlineEdit.update(state => ({ ...state, enabled }));
  }
}
