import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnChanges, OnInit, QueryList, ViewChildren, signal, Signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputHolderComponent } from '@components/input-holder/input-holder.component';
import { FormInputData } from '@interfaces/form-input-data';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';
import { Project } from '@interfaces/project';
import { FormBuilderStore } from '@app/core/form-builder.store';
import { getSideBarData } from '@pages/edit/config/edit-data-config';
import { EditList } from '@pages/edit/interfaces/edit-list';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import { RepeatedSectionList, SectionList } from '@pages/edit/interfaces/section-list';
import { ProjectService } from '@services/project.service';
import { cloneDeep } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { InstanceOfSectionListPipe } from '@app/shared/pipes/instance-of-section-list.pipe';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { NzContentComponent, NzLayoutComponent, NzSiderComponent } from 'ng-zorro-antd/layout';
import { SidebarComponent } from '@app/shared/components/sidebar/sidebar.component';
import { NzCardComponent } from 'ng-zorro-antd/card';
import { EditNameComponent } from '@app/shared/components/edit-name/edit-name.component';
import { NzOptionComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { InstanceOfRepeatedSectionPipe } from '@app/shared/pipes/instance-of-repeated-section.pipe';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzCollapseComponent, NzCollapsePanelComponent } from 'ng-zorro-antd/collapse';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ComponentIconsPipe } from '@app/shared/pipes/used-component-icons.pipe';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzSwitchComponent } from 'ng-zorro-antd/switch';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { ComponentService } from '@app/shared/services/component.service';
import { ModalService } from '@app/shared/services/modal.service';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { SidebarData } from '@components/sidebar/interfaces/sidebar-data';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzLayoutComponent,
    NzSiderComponent,
    SidebarComponent,
    NzContentComponent,
    DragDropModule,
    InstanceOfSectionListPipe,
    NzCardComponent,
    EditNameComponent,
    TranslatePipe,
    NzSelectComponent,
    InstanceOfRepeatedSectionPipe,
    NzOptionComponent,
    NzPopconfirmModule,
    NzPopoverModule,
    NzDrawerModule,
    InputHolderComponent,
    InstanceOfFormInputDataPipe,
    NzCollapseComponent,
    NzCollapsePanelComponent,
    NzIconModule,
    ComponentIconsPipe,
    NzButtonComponent,
    NzInputNumberComponent,
    NzSwitchComponent,
    NzTooltipDirective,
  ],
})
export class EditComponent implements OnInit, OnChanges {
  @Input() inlineEdit!: InlineEdit;
  @Input() projectId?: string;
  @Input() versionNum?: number;

  @ViewChildren(InputHolderComponent) inputComponents!: QueryList<InputHolderComponent>;

  private readonly _sideBarData: WritableSignal<SidebarData[]> = signal([]);
  public readonly sideBarData: Signal<SidebarData[]> = this._sideBarData.asReadonly();

  private readonly _editList: WritableSignal<EditList[]> = signal([]);
  public readonly editList: Signal<EditList[]> = this._editList.asReadonly();

  private readonly _names: WritableSignal<string[]> = signal([]);
  public readonly names: Signal<string[]> = this._names.asReadonly();

  private readonly _isMobileView: WritableSignal<boolean> = signal(false);
  public readonly isMobileView: Signal<boolean> = this._isMobileView.asReadonly();

  private readonly _repeatedSettingsDrawerVisible: WritableSignal<boolean> = signal(false);
  public readonly repeatedSettingsDrawerVisible: Signal<boolean> = this._repeatedSettingsDrawerVisible.asReadonly();

  private readonly _activeRepeatedSection: WritableSignal<RepeatedSectionList | null> = signal(null);
  public readonly activeRepeatedSection: Signal<RepeatedSectionList | null> = this._activeRepeatedSection.asReadonly();

  LayoutEnum = LayoutEnum;

  constructor(
    private modalService: ModalService,
    private projectService: ProjectService<Project>,
    private store: FormBuilderStore,
    private componentService: ComponentService,
    private translate: TranslateService,
    private instanceOfSectionListPipe: InstanceOfSectionListPipe,
    private instanceOfFormInputDataPipe: InstanceOfFormInputDataPipe
  ) {}

  ngOnInit() {
    this._sideBarData.set(getSideBarData(this, this.translate));
    this.updateViewMode();
    this.loadProject();
    this.initializeUndoRedo();
  }

  ngOnChanges() {
    this.loadProject();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateViewMode();
  }

  getSectionIds: () => string[] = () =>
    this._editList().filter((edit) => this.instanceOfSectionListPipe.transform(edit.data)).map((sect) => sect.id);

  getAllFormInputs: () => FormInputData[] = () => {
    if (this._editList().length === 0 && this.projectId) {
      const project = this.projectService.searchData(this.projectId)[0];
      if (project?.editList && project.editList.length > 0) {
        this._editList.set(this.cleanCorruptedData(cloneDeep(project.editList)));
        this._names.set(this.getCustomTitles());
      }
    }

    return this._editList().flatMap((edit) => {
      if (this.instanceOfSectionListPipe.transform(edit.data)) {
        return (edit.data as SectionList).sectionInputs;
      }
      return edit.data as FormInputData;
    });
  };

  sectionDropListEnterPredicate: (item: CdkDrag, list: CdkDropList<FormInputData[]>) => boolean = (item, _list) =>
    item.data && (this.instanceOfFormInputDataPipe.transform(item.data) || this.instanceOfFormInputDataPipe.transform(item.data.data));

  saveForm(): void {
    const project = this.projectService.searchData(this.projectId!)[0];
    if (project) {
      project.editList = [];
      for (const edit of this._editList()) {
        project.editList.push(cloneDeep(edit));
      }
      this._names.set(this.getCustomTitles());
      this.projectService.update(this.projectId!, project);
    }
    this.pushToStore();
  }

  public pushToStore() {
    this.store.updateProject({ editList: cloneDeep(this._editList()), isComponentsValid: !this.isFormInvalid() });
    this.store.isComponentsFormValid.set(!this.isFormInvalid());
  }

  private loadProject(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum ?? 1);
      if (project?.editList) {
        this._editList.set(this.cleanCorruptedData(cloneDeep(project.editList)));
        this._names.set(this.getCustomTitles());
        this.store.saveEditHistory(this._editList());
      }
      this.componentService.component$.next(this._editList());
      setTimeout(() => {
        this.store.isComponentsFormValid.set(!this.isFormInvalid());
      });
    }
  }

  private cleanCorruptedData(list: EditList[]): EditList[] {
    for (const edit of list) {
      if (!edit.id || edit.id === '') {
        edit.id = uuidv4();
      }

      if (this.instanceOfFormInputDataPipe.transform(edit.data)) {
        const inputData = edit.data as FormInputData;
        if (inputData.data && (!inputData.data.id || inputData.data.id === '')) {
          inputData.data.id = uuidv4();
        }
      }

      if (this.instanceOfSectionListPipe.transform(edit.data)) {
        const section = edit.data as SectionList;
        if (!section.sectionInputs) {
          section.sectionInputs = [];
        }

        section.sectionInputs = section.sectionInputs.map((input: any) => {
          let cleaned = input;
          if (input.id && input.data && !input.type) {
            cleaned = input.data;
          }

          if (cleaned.data && (!cleaned.data.id || cleaned.data.id === '')) {
            cleaned.data.id = uuidv4();
          }

          return cleaned;
        });
      }
    }
    return list;
  }

  private initializeUndoRedo(): void {
    if (this.getAllFormInputs() && this.getAllFormInputs().length > 0) {
      this.store.clearEditHistory();
      this.store.saveEditHistory(this._editList());
      this.componentService.component$.next(this._editList());
    }
  }

  undoRedo(undoRedoEvent: UndoRedoEnum): void {
    if (undoRedoEvent === UndoRedoEnum.UNDO) {
      this._editList.set(this.store.undoEdit() ?? []);
      this._names.set(this.getCustomTitles());
      this.componentService.component$.next(this._editList());
    } else {
      this._editList.set(this.store.redoEdit() ?? []);
      this._names.set(this.getCustomTitles());
      this.componentService.component$.next(this._editList());
    }
    this.pushToStore();
  }

  dropIntoEdit(event: CdkDragDrop<EditList[], EditList[] | FormInputData[], EditList | FormInputData>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (this.instanceOfFormInputDataPipe.transform(event.item.data) && !event.item.data.data?.id) {
      const droppedInput: FormInputData = event.item.data as FormInputData;
      if (droppedInput.title === 'SECTION') {
        const newSectionId = uuidv4();
        const newSectionEdit: EditList = {
          id: newSectionId,
          data: {
            sectionId: newSectionId,
            layout: LayoutEnum.VERTICAL,
            reorderEnabled: false,
            sectionInputs: [],
            type: droppedInput.type as any,
            data: {
              id: newSectionId,
              sectionId: newSectionId,
            },
            codeEditor: {
              enabled: false,
            },
          },
        };
        this._names.set(this.getCustomTitles());
        event.container.data.splice(event.currentIndex, 0, newSectionEdit);
      } else {
        const newItemId = uuidv4();
        const newItem: FormInputData = cloneDeep(droppedInput);

        if (!newItem.data) {
          newItem.data = {} as any;
        }

        newItem.codeEditor = {
          enabled: droppedInput.codeEditor?.enabled ?? false,
        };

        if (droppedInput.customTitle && droppedInput.customTitle !== '') {
          newItem.customTitle = droppedInput.customTitle;
        }

        newItem.data!.id = newItemId;
        newItem.data!.sectionId = event.container.id;
        newItem.data!.draft = true;
        const newInputEdit: EditList = {
          id: newItemId,
          data: newItem,
        };

        this._names.set(this.getCustomTitles());
        event.container.data.splice(event.currentIndex, 0, newInputEdit);
      }
    } else if (this.instanceOfFormInputDataPipe.transform(event.item.data)) {
      const formInputData = event.item.data as FormInputData;

      if (!formInputData.data) {
        formInputData.data = {} as any;
      }

      if (formInputData.codeEditor) {
        formInputData.codeEditor.enabled = false;
      }

      formInputData.data!.sectionId = event.container.id;

      const transferredInput: EditList = {
        id: formInputData.data!.id!,
        data: formInputData,
      };

      this._names.set(this.getCustomTitles());
      event.container.data.splice(event.currentIndex, 0, transferredInput);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    this._editList.update(list => [...list]);
    this.updateRepeated();
    this.store.saveEditHistory(this._editList());
    this.componentService.component$.next(this._editList());
    this.pushToStore();
  }

  dropIntoSection(event: CdkDragDrop<FormInputData[], EditList[] | FormInputData[], EditList | FormInputData>): void {
    const eventData: CdkDragDrop<FormInputData[]> = event as CdkDragDrop<FormInputData[]>;
    const draggable: CdkDrag = eventData.item;
    const data: EditList = draggable.data as EditList;
    const innerData: FormInputData = data.data as FormInputData;

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (this.getSectionIds().includes(event.container.id) && this.getSectionIds().includes(event.previousContainer.id)) {
      const sectionList = data.data as SectionList;
      sectionList.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, draggable.data as FormInputData);
      event.previousContainer.data.splice(event.previousIndex, 1);
    } else if (!innerData.data?.id) {
      const droppedInput: FormInputData = draggable.data as FormInputData;
      const newItemId = uuidv4();
      const newItem: FormInputData = cloneDeep(droppedInput);
      newItem.data!.id = newItemId;
      newItem.data!.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, newItem);
    } else {
      const droppedInput: FormInputData = draggable.data as FormInputData;
      const movedItem: FormInputData = cloneDeep(droppedInput);

      let toMove: FormInputData;
      if (this.instanceOfFormInputDataPipe.transform(movedItem)) {
        toMove = movedItem;
      } else {
        toMove = (movedItem as any).data as FormInputData;
      }

      event.container.data.splice(event.currentIndex, 0, toMove as any);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    this._editList.update(list => [...list]);
    this.updateRepeated();
    this.store.saveEditHistory(this._editList());
    this.componentService.component$.next(this._editList());
    this.pushToStore();
  }

  getEditDropListConnectedTo(): string[] {
    return this.getSectionIds();
  }

  getSectionDropListConnectedTo(sect: SectionList): string[] {
    if (sect.reorderEnabled) {
      return [];
    }
    return this.getSectionIds().concat(['sectionDropList']);
  }

  removeEditComponent(edit: EditList): void {
    this._editList.update(list => list.filter((e) => e.id !== edit.id));
    this._names.set(this.getCustomTitles());
    this.updateRepeated();
    this.store.saveEditHistory(this._editList());
    this.componentService.component$.next(this._editList());
    this.pushToStore();
  }

  removeSectionComponent(sect: SectionList, componentId: string): void {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data!.id !== componentId);
    this._editList.update(list => [...list]);
    this.updateRepeated();
    this.store.saveEditHistory(this._editList());
    this.componentService.component$.next(this._editList());
    this.pushToStore();
  }

  getSectionInputStyle(sect: SectionList): { [p: string]: string } {
    let width: number;
    if (sect.sectionInputs.some((edit) => this.instanceOfSectionListPipe.transform(edit.data as any)) || sect.layout === LayoutEnum.VERTICAL) {
      width = 100;
    } else {
      width = 100 / sect.sectionInputs.length - 1;
    }
    return {
      width: `${width.toString()}%`,
    };
  }

  sectionEdit(sectionData: SectionList): void {
    this.modalService.openSectionModal(sectionData);
  }

  sectionLayoutChange(sect: SectionList): void {
    if (sect.layout === LayoutEnum.VERTICAL) {
      sect.layout = LayoutEnum.HORIZONTAL;
    } else {
      sect.layout = LayoutEnum.VERTICAL;
    }
    this._editList.update(list => [...list]);
    this.store.saveEditHistory(this._editList());
    this.componentService.component$.next(this._editList());
    this.pushToStore();
  }

  openRepeatedSettings(section: RepeatedSectionList): void {
    this.updateRepeated();
    this._activeRepeatedSection.set(section);
    if (this._isMobileView()) {
      this._repeatedSettingsDrawerVisible.set(true);
    }
  }

  closeRepeatedSettingsDrawer(): void {
    this._repeatedSettingsDrawerVisible.set(false);
    this._activeRepeatedSection.set(null);
  }

  onRepeatedPopoverVisibleChange(visible: boolean, section: RepeatedSectionList): void {
    if (visible) {
      this.openRepeatedSettings(section);
    }
  }

  getRepeatedSettingsSummary(section: RepeatedSectionList): string {
    if (section.repeatByOther) {
      return section.referencedInput || this.translate.instant('COMPONENTS.SECTION.REPEATED.UNSPECIFIED');
    }
    return `${section.repeatTimes}x`;
  }

  hasRepeatedSettingsError(section: RepeatedSectionList): boolean {
    if (!section.repeatByOther) {
      return !section.repeatTimes || section.repeatTimes < 1;
    }

    const referencedInput = section.referencedInput?.trim();
    if (!referencedInput) {
      return true;
    }

    return !section.referencableInputs?.includes(referencedInput);
  }

  hasRepeatedSettingsErrorForEdit(edit: EditList): boolean {
    if (!this.instanceOfSectionListPipe.transform(edit.data) || edit.data.type !== 'RepeatedSectionComponent') {
      return false;
    }
    return this.hasRepeatedSettingsError(edit.data as RepeatedSectionList);
  }

  isFormInvalid(): boolean {
    this.updateRepeated();
    const hasRepeatedValidationError = this._editList().some((edit) => this.hasRepeatedSettingsErrorForEdit(edit));
    return this.getAllFormInputs().length === 0 || this.inputComponents.some((inp) => !inp.isValid()) || hasRepeatedValidationError;
  }

  isComponentInvalid(edit: EditList): boolean {
    if (this.instanceOfSectionListPipe.transform(edit.data)) {
      return (edit.data as SectionList).sectionInputs.some((inp) => this.isInputInvalid(inp));
    }
    return this.isInputInvalid(edit.data as FormInputData);
  }

  isComponentDraft(edit: EditList): boolean {
    if (this.instanceOfSectionListPipe.transform(edit.data)) {
      return false;
    }
    return (edit.data as FormInputData).data?.draft ?? false;
  }

  isInputInvalid(input: FormInputData): boolean {
    if (!input?.data) return true;
    const val = input.data.questionValue;
    return (!val || val.trim().length === 0) && !input.data.draft;
  }

  onValueChanged<D extends InputData<T>, T>(event: D): void {
    this.store.saveEditHistory(this._editList());
    this.componentService.component$.next(this._editList());
    this.pushToStore();
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }

  updateName(): void {
    this._names.set(this.getCustomTitles());
    this.updateRepeated();
    this.store.saveEditHistory(this._editList());
    this.pushToStore();
  }

  public isLogicEnabled(item: any): boolean {
    return !!item?.codeEditor?.enabled;
  }

  public getConditionTooltip(item: any): string {
    const code = item?.codeEditor?.data?.code;
    if (code && code.trim() !== '') {
      return code;
    }
    return this.translate.instant('COMPONENTS.CODE_MIRROR');
  }

  private getCustomTitles(): string[] {
    return this._editList()
      .filter((e) => e.data.customTitle)
      .map((e) => e.data.customTitle as string);
  }

  returnChildren(sect: SectionList): { title: string; id: string }[] {
    const returnVal: { title: string; id: string }[] = [];
    for (const input of sect.sectionInputs) {
      let id: string = input.data?.id || '';
      returnVal.push({
        title: input.title,
        id: id,
      });
    }
    return returnVal;
  }

  private isReferencable(input: FormInputData): input is FormInputData & { customTitle: string } {
    return (input.type === 'CheckboxGroupComponent' || input.type === 'NumberInputComponent') && !!input.customTitle;
  }

  private getReferencables(id: string): string[] {
    const currentList = this._editList();
    const ind = currentList.findIndex((item) => item.id === id);

    const list: EditList[] = cloneDeep(currentList);
    list.splice(ind);

    return list.flatMap((input) => {
      const isSectionList = this.instanceOfSectionListPipe.transform(input.data);

      if (isSectionList) {
        return (input.data as SectionList).sectionInputs
          .filter((item) => this.isReferencable(item))
          .map((item) => item.customTitle as string);
      }

      return this.isReferencable(input.data as FormInputData) && input.data.customTitle ? [input.data.customTitle] : [];
    });
  }

  private updateRepeated() {
    const currentList = this._editList();
    currentList
      .filter((item) => item.data.type === 'RepeatedSectionComponent')
      .forEach((item) => {
        const repeatedSection = item.data as RepeatedSectionList;
        repeatedSection.referencableInputs = this.getReferencables(item.id);
      });

    this._editList.update(list => [...list]);
  }

  private updateViewMode(): void {
    this._isMobileView.set(window.innerWidth <= 1200);
    if (!this._isMobileView() && this._repeatedSettingsDrawerVisible()) {
      this.closeRepeatedSettingsDrawer();
    }
  }
}
