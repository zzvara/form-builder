import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { InputHolderComponent } from '@components/input-holder/input-holder.component';
import { FormInputData } from '@interfaces/form-input-data';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';
import { Project } from '@interfaces/project';
import { getSideBarData } from '@pages/edit/config/edit-data-config';
import { EditList } from '@pages/edit/interfaces/edit-list';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import { RepeatedSectionList, SectionList } from '@pages/edit/interfaces/section-list';
import { ProjectService } from '@services/project.service';
import { UndoRedoService } from '@services/undo-redo.service';
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
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onWindowResize()',
  },
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
export class EditComponent implements OnInit {
  readonly inlineEdit = input.required<InlineEdit>();
  readonly projectId = input<string>();
  readonly versionNum = input<number>();

  readonly inputComponents = viewChildren(InputHolderComponent);

  sideBarData = getSideBarData(this, this.translate);

  readonly editList = signal<EditList[]>([]);
  readonly names = signal<string[]>([]);
  readonly isMobileView = signal(false);
  readonly repeatedSettingsDrawerVisible = signal(false);
  readonly activeRepeatedSection = signal<RepeatedSectionList | null>(null);

  LayoutEnum = LayoutEnum;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private modalService: ModalService,
    private projectService: ProjectService<Project>,
    private undoRedoService: UndoRedoService<EditList[]>,
    private componentService: ComponentService,
    private translate: TranslateService,
    private instanceOfSectionListPipe: InstanceOfSectionListPipe,
    private instanceOfFormInputDataPipe: InstanceOfFormInputDataPipe,
  ) {
    // (Re)load the project whenever the edited project or its version changes
    effect(() => {
      this.projectId();
      this.versionNum();
      untracked(() => this.reload());
    });
  }

  ngOnInit() {
    this.sideBarData = getSideBarData(this, this.translate);
    this.updateViewMode();
  }

  /**
   * Loads the project and resets the undo/redo history.
   * @returns {void}
   */
  reload(): void {
    this.loadProject();
    this.initializeUndoRedo();
  }

  onWindowResize(): void {
    this.updateViewMode();
  }

  getSectionIds: () => string[] = () =>
    this.editList()
      .filter((edit) => this.instanceOfSectionListPipe.transform(edit.data))
      .map((sect) => sect.id);

  getAllFormInputs: () => FormInputData[] = () => {
    // If editList is empty but there's JSON data with editList, use that instead
    const projectId = this.projectId();
    if (this.editList().length === 0 && projectId) {
      const project = this.projectService.searchData(projectId)[0];
      if (project?.editList && project.editList.length > 0) {
        this.editList.set(this.cleanCorruptedData(cloneDeep(project.editList)));
        this.names.set(this.getCustomTitles());
      }
    }

    return this.editList().flatMap((edit) => {
      if (this.instanceOfSectionListPipe.transform(edit.data)) {
        return edit.data.sectionInputs;
      }
      return edit.data as FormInputData;
    });
  };

  sectionDropListEnterPredicate: (item: CdkDrag, list: CdkDropList<FormInputData[]>) => boolean = (
    item,
    _list,
  ) =>
    item.data &&
    (this.instanceOfFormInputDataPipe.transform(item.data) ||
      this.instanceOfFormInputDataPipe.transform(item.data.data));

  /**
   * Saves the current state of the form inputs to the project.
   * It then calls the project service to persist the updated project data.
   * @returns {void}
   */
  saveForm(): void {
    const projectId = this.projectId()!;
    const project = this.projectService.searchData(projectId)[0];
    if (project) {
      project.editList = [];
      for (const edit of this.editList()) {
        project.editList.push(cloneDeep(edit));
      }
      this.names.set(this.getCustomTitles());
      this.projectService.update(projectId, project);
    }
  }

  /**
   * Loads project form inputs based on the current project ID and version number.
   * If a project and its form inputs are found, it updates the formInputs array with the project's form inputs.
   * @returns {void}
   */
  private loadProject(): void {
    const projectId = this.projectId();
    if (projectId !== undefined) {
      const project = this.projectService.getProjectVersion(projectId, this.versionNum() ?? 1);
      if (project?.editList) {
        this.editList.set(this.cleanCorruptedData(cloneDeep(project.editList)));
        this.names.set(this.getCustomTitles());
        this.undoRedoService.saveState(this.editList());
      }
      this.componentService.setComponents(this.editList());
    }
  }

  /**
   * This method will find old bad data (empty IDs or bad packaging)
   * and completely fix it on load!
   */
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

  /**
   * Initializes the undo/redo service by saving the current state of the form inputs.
   * @returns {void}
   */
  private initializeUndoRedo(): void {
    if (this.getAllFormInputs() && this.getAllFormInputs().length > 0) {
      this.undoRedoService.clearHistory();
      this.undoRedoService.saveState(this.editList());
      this.componentService.setComponents(this.editList());
    }
  }

  undoRedo(undoRedoEvent: UndoRedoEnum): void {
    if (undoRedoEvent === UndoRedoEnum.UNDO) {
      this.editList.set(this.undoRedoService.undo() ?? []);
    } else {
      this.editList.set(this.undoRedoService.redo() ?? []);
    }
    this.names.set(this.getCustomTitles());
    this.componentService.setComponents(this.editList());
  }

  /**
   * Notifies the consumers of the edit list that its items were modified in place.
   * @returns {void}
   */
  private refreshView(): void {
    this.editList.update((editList) => [...editList]);
  }

  /**
   * Publishes the in place modified edit list: refreshes the view, saves the undo/redo state
   * and notifies the component service.
   * @returns {void}
   */
  private commit(): void {
    this.refreshView();
    this.undoRedoService.saveState(this.editList());
    this.componentService.setComponents(this.editList());
  }

  dropIntoEdit(
    event: CdkDragDrop<EditList[], EditList[] | FormInputData[], EditList | FormInputData>,
  ): void {
    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (
      this.instanceOfFormInputDataPipe.transform(event.item.data) &&
      !event.item.data.data?.id
    ) {
      const droppedInput: FormInputData = event.item.data;
      if (droppedInput.title === 'SECTION') {
        const newSectionId = uuidv4();
        const newSectionEdit: EditList = {
          id: newSectionId,
          data: {
            sectionId: newSectionId,
            layout: LayoutEnum.VERTICAL,
            reorderEnabled: false,
            sectionInputs: [],
            type: droppedInput.type,
            data: {
              id: newSectionId,
              sectionId: newSectionId,
            },
            codeEditor: {
              enabled: false,
            },
          },
        };
        this.names.set(this.getCustomTitles());
        event.container.data.splice(event.currentIndex, 0, newSectionEdit);
      } else {
        // Create a deep copy of the dropped item with updated ID
        const newItemId = uuidv4();
        const newItem: FormInputData = cloneDeep(droppedInput);

        // Initialize data if it's null
        if (!newItem.data) {
          newItem.data = {};
        }

        newItem.codeEditor = {
          enabled: droppedInput.codeEditor?.enabled ?? false,
        };

        if (droppedInput.customTitle && droppedInput.customTitle !== '') {
          newItem.customTitle = droppedInput.customTitle;
        }

        newItem.data.id = newItemId;
        newItem.data.sectionId = event.container.id;
        newItem.data.draft = true;
        const newInputEdit: EditList = {
          id: newItemId,
          data: newItem,
        };

        this.names.set(this.getCustomTitles());

        event.container.data.splice(event.currentIndex, 0, newInputEdit);
      }
    } else if (this.instanceOfFormInputDataPipe.transform(event.item.data)) {
      // Initialize data if it's null
      if (!event.item.data.data) {
        event.item.data.data = {};
      }

      if (event.item.data.codeEditor) {
        event.item.data.codeEditor.enabled = false;
      }

      event.item.data.data.sectionId = event.container.id;
      const transferredInput: EditList = {
        id: event.item.data.data.id!,
        data: event.item.data,
      };
      this.names.set(this.getCustomTitles());
      event.container.data.splice(event.currentIndex, 0, transferredInput);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    this.updateRepeated();
    this.commit();
  }

  dropIntoSection(
    event: CdkDragDrop<FormInputData[], EditList[] | FormInputData[], EditList | FormInputData>,
  ): void {
    const eventData: CdkDragDrop<FormInputData[]> = event as CdkDragDrop<FormInputData[]>;
    const draggable: CdkDrag = eventData.item;
    const data: EditList = draggable.data;
    const innerData: FormInputData = data.data as FormInputData;
    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (
      this.getSectionIds().includes(event.container.id) &&
      this.getSectionIds().includes(event.previousContainer.id)
    ) {
      // Move items between sections
      const sectionList = data.data as SectionList;
      sectionList.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, draggable.data as FormInputData);
      event.previousContainer.data.splice(event.previousIndex, 1);
    } else if (!innerData.data?.id) {
      // Add a completely new item to any drop list
      const droppedInput: FormInputData = draggable.data;
      const newItemId = uuidv4();
      const newItem: FormInputData = cloneDeep(droppedInput);
      newItem.data!.id = newItemId;
      newItem.data!.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, newItem);
    } else {
      // Move existing item from edit area to section or from section to edit area
      const droppedInput: any = draggable.data;
      const movedItem = cloneDeep(droppedInput);

      let toMove: FormInputData;

      if (this.instanceOfFormInputDataPipe.transform(movedItem)) {
        toMove = movedItem;
      } else {
        toMove = movedItem.data;
      }

      event.container.data.splice(event.currentIndex, 0, toMove);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
    this.updateRepeated();
    this.commit();
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
    this.editList.set(this.editList().filter((e) => e.id !== edit.id));
    this.names.set(this.getCustomTitles());

    this.updateRepeated();
    this.commit();
  }

  removeSectionComponent(sect: SectionList, componentId: string): void {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data!.id !== componentId);

    this.updateRepeated();
    this.commit();
  }

  getSectionInputStyle(sect: SectionList): { [p: string]: string } {
    let width: number;
    if (
      sect.sectionInputs.some((edit) => this.instanceOfSectionListPipe.transform(edit as any)) ||
      sect.layout === LayoutEnum.VERTICAL
    ) {
      width = 100;
    } else {
      width = 100 / sect.sectionInputs.length - 1;
    }
    return {
      width: `${width.toString()}%`,
    };
  }

  sectionEdit(sectionData: SectionList): void {
    // The modal updates the code editor settings of the section in place
    this.modalService
      .openSectionModal(sectionData)
      .afterClose.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refreshView());
  }

  sectionLayoutChange(sect: SectionList): void {
    if (sect.layout === LayoutEnum.VERTICAL) {
      sect.layout = LayoutEnum.HORIZONTAL;
    } else {
      sect.layout = LayoutEnum.VERTICAL;
    }
    this.commit();
  }

  openRepeatedSettings(section: RepeatedSectionList): void {
    this.updateRepeated();
    this.activeRepeatedSection.set(section);
    if (this.isMobileView()) {
      this.repeatedSettingsDrawerVisible.set(true);
    }
  }

  closeRepeatedSettingsDrawer(): void {
    this.repeatedSettingsDrawerVisible.set(false);
    this.activeRepeatedSection.set(null);
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

    const hasRepeatedValidationError = this.editList().some((edit) => this.hasRepeatedSettingsErrorForEdit(edit));
    return this.getAllFormInputs().length === 0 || this.inputComponents().some((inp) => !inp.isValid()) || hasRepeatedValidationError;
  }

  isComponentInvalid(edit: EditList): boolean {
    if (this.instanceOfSectionListPipe.transform(edit.data)) {
      return edit.data.sectionInputs.some((inp) => this.isInputInvalid(inp));
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

  /**
   * Handles the event when the value of a form input changes.
   * This method updates the corresponding form input's value based on the selection made by the user.
   * @param sect
   * @param event - The event object containing the new value of the form input.
   * @returns {void}
   */
  onValueChanged<D extends InputData<T>, T>(event: D): void {
    this.commit();
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
    this.names.set(this.getCustomTitles());
    this.updateRepeated();
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
    return this.editList()
      .filter((e) => e.data.customTitle)
      .map((e) => e.data.customTitle) as string[];
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
    return (
      (input.type === 'CheckboxGroupComponent' || input.type === 'NumberInputComponent') &&
      !!input.customTitle
    );
  }

  private getReferencables(id: string): string[] {
    const ind = this.editList().findIndex((item) => item.id === id);

    const list: EditList[] = cloneDeep(this.editList());
    list.splice(ind);

    return list.flatMap((input) => {
      const isSectionList = this.instanceOfSectionListPipe.transform(input.data);

      if (isSectionList) {
        return (input.data as SectionList).sectionInputs
          .filter((item) => this.isReferencable(item))
          .map((item) => item.customTitle);
      }

      return this.isReferencable(input.data as FormInputData) && input.data.customTitle
        ? [input.data.customTitle]
        : [];
    });
  }

  private updateRepeated() {
    this.editList()
      .filter((item) => item.data.type === 'RepeatedSectionComponent')
      .forEach((item) => {
        const repeatedSection = item.data as RepeatedSectionList;
        repeatedSection.referencableInputs = this.getReferencables(item.id);
      });
  }

  private updateViewMode(): void {
    this.isMobileView.set(window.innerWidth <= 1200);
    if (!this.isMobileView() && this.repeatedSettingsDrawerVisible()) {
      this.closeRepeatedSettingsDrawer();
    }
  }
}
