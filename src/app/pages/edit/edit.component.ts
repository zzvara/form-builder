import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit, QueryList, ViewChildren, signal, Signal, WritableSignal } from '@angular/core';
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
import { TranslateService } from '@ngx-translate/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { InstanceOfSectionListPipe } from '@app/shared/pipes/instance-of-section-list.pipe';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { SidebarData } from '@components/sidebar/interfaces/sidebar-data';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
  standalone: false,
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

  // -----------------------------

  LayoutEnum = LayoutEnum;

  constructor(
    private projectService: ProjectService<Project>,
    private undoRedoService: UndoRedoService<EditList[]>,
    private translate: TranslateService,
    private instanceOfSectionListPipe: InstanceOfSectionListPipe,
    private instanceOfFormInputDataPipe: InstanceOfFormInputDataPipe
  ) {}

  ngOnInit() {
    this._sideBarData.set(getSideBarData(this, this.translate));
    this.loadProject();
    this.initializeUndoRedo();
  }

  ngOnChanges() {
    this.loadProject();
  }

  getSectionIds: () => string[] = () =>
    this._editList().filter((edit) => this.instanceOfSectionListPipe.transform(edit.data)).map((sect) => sect.id);

  getAllFormInputs: () => FormInputData[] = () => {
    if (this._editList().length === 0 && this.projectId) {
      const project = this.projectService.searchData(this.projectId)[0];
      if (project?.editList && project.editList.length > 0) {
        this._editList.set(cloneDeep(project.editList));
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
  }

  private loadProject(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum ?? 1);
      if (project?.editList) {
        this._editList.set(cloneDeep(project.editList));
        this._names.set(this.getCustomTitles());
        this.undoRedoService.saveState(this._editList());
      }
    }
  }

  private initializeUndoRedo(): void {
    if (this.getAllFormInputs() && this.getAllFormInputs().length > 0) {
      this.undoRedoService.clearHistory();
      this.undoRedoService.saveState(this._editList());
    }
  }

  undoRedo(undoRedoEvent: UndoRedoEnum): void {
    if (undoRedoEvent === UndoRedoEnum.UNDO) {
      this._editList.set(this.undoRedoService.undo() ?? []);
      this._names.set(this.getCustomTitles());
    } else {
      this._editList.set(this.undoRedoService.redo() ?? []);
      this._names.set(this.getCustomTitles());
    }
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
          },
        };
        event.container.data.splice(event.currentIndex, 0, newSectionEdit);
      } else {
        const newItemId = uuidv4();
        const newItem: FormInputData = cloneDeep(droppedInput);

        if (!newItem.data) {
          newItem.data = {} as any;
        }

        newItem.data!.id = newItemId;
        newItem.data!.sectionId = event.container.id;
        newItem.data!.draft = true;
        const newInputEdit: EditList = {
          id: newItemId,
          data: newItem,
        };

        event.container.data.splice(event.currentIndex, 0, newInputEdit);
      }
    } else if (this.instanceOfFormInputDataPipe.transform(event.item.data)) {
      // JAVÍTÁS: Kimentjük egy változóba és explicit szólunk a TS-nek, hogy nem null
      const formInputData = event.item.data as FormInputData;

      if (!formInputData.data) {
        formInputData.data = {} as any;
      }

      formInputData.data!.sectionId = event.container.id;

      const transferredInput: EditList = {
        id: formInputData.data!.id!,
        data: formInputData,
      };

      event.container.data.splice(event.currentIndex, 0, transferredInput);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    this._editList.update(list => [...list]);
    this._names.set(this.getCustomTitles());
    this.updateRepeated();
    this.undoRedoService.saveState(this._editList());
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
      const toMove: any = movedItem.data;
      event.container.data.splice(event.currentIndex, 0, toMove);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }

    this._editList.update(list => [...list]);
    this.updateRepeated();
    this.undoRedoService.saveState(this._editList());
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
    this.undoRedoService.saveState(this._editList());
  }

  removeSectionComponent(sect: SectionList, componentId: string): void {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data!.id !== componentId);
    this._editList.update(list => [...list]);
    this.updateRepeated();
    this.undoRedoService.saveState(this._editList());
  }

  getSectionInputStyle(sect: SectionList): { [p: string]: string } {
    let width: number;
    if (sect.sectionInputs.some((edit) => this.instanceOfSectionListPipe.transform(edit.data)) || sect.layout === LayoutEnum.VERTICAL) {
      width = 100;
    } else {
      width = 100 / sect.sectionInputs.length - 1;
    }
    return {
      width: `${width.toString()}%`,
    };
  }

  sectionLayoutChange(sect: SectionList): void {
    if (sect.layout === LayoutEnum.VERTICAL) {
      sect.layout = LayoutEnum.HORIZONTAL;
    } else {
      sect.layout = LayoutEnum.VERTICAL;
    }
    this._editList.update(list => [...list]);
    this.undoRedoService.saveState(this._editList());
  }

  isFormInvalid(): boolean {
    return this.getAllFormInputs().length === 0 || this.inputComponents.some((inp) => !inp.isValid());
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
    this.undoRedoService.saveState(this._editList());
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
  }

  private getCustomTitles(): string[] {
    return this._editList().filter((e) => e.data.customTitle).map((e) => e.data.customTitle as string);
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
        return (input.data as SectionList).sectionInputs.filter((item) => this.isReferencable(item)).map((item) => item.customTitle as string);
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
}
