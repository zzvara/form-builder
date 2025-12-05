import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input, OnChanges, OnInit, QueryList, ViewChildren } from '@angular/core';
import { InputHolderComponent } from '@components/input-holder/input-holder.component';
import { FormInputData } from '@interfaces/form-input-data';
import { InlineEdit } from '@interfaces/inline-edit';
import { InputData } from '@interfaces/input-data';
import { Project } from '@interfaces/project';
import { getSideBarData } from '@pages/edit/config/edit-data-config';
import { EditList } from '@pages/edit/interfaces/edit-list';
import { LayoutEnum } from '@pages/edit/interfaces/layout-enum';
import { SectionList } from '@pages/edit/interfaces/section-list';
import { ProjectService } from '@services/project.service';
import { UndoRedoService } from '@services/undo-redo.service';
import { cloneDeep } from 'lodash-es';
import { v4 as uuidv4 } from 'uuid';
import { TranslateService } from '@ngx-translate/core';
import { UndoRedoEnum } from '@app/shared/interfaces/undo-redo-type.enum';
import { InstanceOfSectionListPipe } from '@app/shared/pipes/instance-of-section-list.pipe';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { NgStyle } from '@angular/common';

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

  sideBarData = getSideBarData(this, this.translate);

  editList: EditList[] = [];
  names: string[] = [];

  LayoutEnum = LayoutEnum;

  constructor(
    private projectService: ProjectService<Project>,
    private undoRedoService: UndoRedoService<EditList[]>,
    private translate: TranslateService,
    private instanceOfSectionListPipe: InstanceOfSectionListPipe,
    private instanceOfFormInputDataPipe: InstanceOfFormInputDataPipe
  ) {}

  ngOnInit() {
    this.sideBarData = getSideBarData(this, this.translate);
    this.loadProject();
    this.initializeUndoRedo();
  }

  ngOnChanges() {
    this.loadProject();
  }

  getSectionIds: () => string[] = () =>
    this.editList.filter((edit) => this.instanceOfSectionListPipe.transform(edit.data)).map((sect) => sect.id);

  getAllFormInputs: () => FormInputData[] = () => {
    // If editList is empty but there's JSON data with editList, use that instead
    if (this.editList.length === 0 && this.projectId) {
      const project = this.projectService.searchData(this.projectId)[0];
      if (project?.editList && project.editList.length > 0) {
        this.editList = cloneDeep(project.editList);
        this.names = this.getCustomTitles();
      }
    }

    return this.editList.flatMap((edit) => {
      if (this.instanceOfSectionListPipe.transform(edit.data)) {
        return edit.data.sectionInputs;
      }
      return edit.data;
    });
  };

  sectionDropListEnterPredicate: (item: CdkDrag, list: CdkDropList<FormInputData[]>) => boolean = (item, _list) =>
    item.data && (this.instanceOfFormInputDataPipe.transform(item.data) || this.instanceOfFormInputDataPipe.transform(item.data.data));

  /**
   * Saves the current state of the form inputs to the project.
   * It then calls the project service to persist the updated project data.
   * @returns {void}
   */
  saveForm(): void {
    const project = this.projectService.searchData(this.projectId!)[0];
    if (project) {
      project.editList = [];
      for (const edit of this.editList) {
        project.editList.push(cloneDeep(edit));
      }
      this.names = this.getCustomTitles();
      this.projectService.update(this.projectId!, project);
    }
  }

  /**
   * Loads project form inputs based on the current project ID and version number.
   * If a project and its form inputs are found, it updates the formInputs array with the project's form inputs.
   * @returns {void}
   */
  private loadProject(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum ?? 1);
      if (project?.editList) {
        this.editList = cloneDeep(project.editList);
        this.names = this.getCustomTitles();
        this.undoRedoService.saveState(this.editList);
      }
    }
  }

  /**
   * Initializes the undo/redo service by saving the current state of the form inputs.
   * @returns {void}
   */
  private initializeUndoRedo(): void {
    if (this.getAllFormInputs() && this.getAllFormInputs().length > 0) {
      this.undoRedoService.clearHistory();
      this.undoRedoService.saveState(this.editList);
    }
  }

  undoRedo(undoRedoEvent: UndoRedoEnum): void {
    if (undoRedoEvent === UndoRedoEnum.UNDO) {
      this.editList = this.undoRedoService.undo() ?? [];
      this.names = this.getCustomTitles();
    } else {
      this.editList = this.undoRedoService.redo() ?? [];
      this.names = this.getCustomTitles();
    }
  }

  dropIntoEdit(event: CdkDragDrop<EditList[], EditList[] | FormInputData[], EditList | FormInputData>): void {
    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (this.instanceOfFormInputDataPipe.transform(event.item.data) && !event.item.data.data?.id) {
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
          },
        };
        this.names = this.getCustomTitles();
        event.container.data.splice(event.currentIndex, 0, newSectionEdit);
      } else {
        // Create a deep copy of the dropped item with updated ID
        const newItemId = uuidv4();
        const newItem: FormInputData = cloneDeep(droppedInput);

        // Initialize data if it's null
        if (!newItem.data) {
          newItem.data = {};
        }

        newItem.data.id = newItemId;
        newItem.data.sectionId = event.container.id;
        const newInputEdit: EditList = {
          id: newItemId,
          data: newItem,
        };
        this.names = this.getCustomTitles();
        event.container.data.splice(event.currentIndex, 0, newInputEdit);
      }
    } else if (this.instanceOfFormInputDataPipe.transform(event.item.data)) {
      // Initialize data if it's null
      if (!event.item.data.data) {
        event.item.data.data = {};
      }

      event.item.data.data.sectionId = event.container.id;
      const transferredInput: EditList = {
        id: event.item.data.data.id!,
        data: event.item.data,
      };
      this.names = this.getCustomTitles();
      event.container.data.splice(event.currentIndex, 0, transferredInput);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
    this.undoRedoService.saveState(this.editList);
  }

  dropIntoSection(event: CdkDragDrop<FormInputData[], EditList[] | FormInputData[], EditList | FormInputData>): void {
    let eventData: CdkDragDrop<FormInputData[]> = event as CdkDragDrop<FormInputData[]>;
    let draggable: CdkDrag = eventData.item;
    let data: EditList = draggable.data;
    let innerData: FormInputData = data.data as FormInputData;
    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if (this.getSectionIds().includes(event.container.id) && this.getSectionIds().includes(event.previousContainer.id)) {
      // Move items between sections
      let sectionList = data.data as SectionList;
      sectionList.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, draggable.data);
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
      const droppedInput: FormInputData = draggable.data;
      const movedItem: FormInputData = cloneDeep(droppedInput);
      let toMove: any = movedItem.data;
      event.container.data.splice(event.currentIndex, 0, toMove);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
    this.undoRedoService.saveState(this.editList);
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
    this.editList = this.editList.filter((e) => e.id !== edit.id);
    this.names = this.getCustomTitles();
    this.undoRedoService.saveState(this.editList);
  }

  removeSectionComponent(sect: SectionList, componentId: string): void {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data!.id !== componentId);
    this.undoRedoService.saveState(this.editList);
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
    this.undoRedoService.saveState(this.editList);
  }

  isFormInvalid(): boolean {
    return this.getAllFormInputs().length === 0 || this.inputComponents.some((inp) => !inp.isValid());
  }

  /**
   * Handles the event when the value of a form input changes.
   * This method updates the corresponding form input's value based on the selection made by the user.
   * @param sect
   * @param event - The event object containing the new value of the form input.
   * @returns {void}
   */
  onValueChanged<D extends InputData<T>, T>(event: D): void {
    this.undoRedoService.saveState(this.editList);
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
    this.names = this.getCustomTitles();
  }

  private getCustomTitles(): string[] {
    return this.editList.filter((e) => e.data.customTitle).map((e) => e.data.customTitle) as string[];
  }
}
