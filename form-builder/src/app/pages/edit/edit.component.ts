import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, inject, Input, OnChanges, OnInit, QueryList, ViewChildren} from '@angular/core';
import {cloneDeep} from "lodash-es";
import {Project} from 'src/app/interfaces/project';
import {ProjectService} from 'src/app/services/project.service';
import {UndoRedoService} from 'src/app/services/undo-redo.service';
import {InputHolderComponent} from "../../shared/components/input-holder/input-holder.component";
import {SidebarData} from "../../shared/components/sidebar/interfaces/sidebar-data";
import {FormInputData, instanceOfFormInputData} from "../../shared/interfaces/form-input-data";
import {InlineEdit} from "../../shared/interfaces/inline-edit";
import {InputData} from "../../shared/interfaces/input-data";
import {getSideBarData} from "./config/edit-data-config";
import {EditList} from "./interfaces/edit-list";
import {LayoutEnum} from "./interfaces/layout-enum";
import {instanceOfSectionList, SectionList} from "./interfaces/section-list";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges {
  private readonly projectService: ProjectService<Project> = inject(ProjectService);
  private readonly undoRedoService: UndoRedoService<EditList[]> = inject(UndoRedoService);

  @Input() inlineEdit!: InlineEdit;
  @Input() projectId: number | undefined;
  @Input() versionNum?: number;

  @ViewChildren(InputHolderComponent) inputComponents!: QueryList<InputHolderComponent>

  sideBarData: SidebarData[] = getSideBarData(this);

  editList: EditList[] = [];
  getSectionIds = () => this.editList
    .filter(edit => instanceOfSectionList(edit.data))
    .map(sect => (sect.data as SectionList).sectionId);
  getAllFormInputs = () => this.editList
    .flatMap(edit => {
      if (instanceOfSectionList(edit.data)) {
        return edit.data.sectionInputs;
      }
      return edit.data;
    });

  sectionDropListEnterPredicate: (item: CdkDrag<EditList | FormInputData>, list: CdkDropList<FormInputData[]>) => boolean =
    (item, _list) => item.data && (instanceOfFormInputData(item.data) || instanceOfFormInputData(item.data.data));

  sectionId!: number;
  sectionComponentId!: number;

  ngOnChanges() {
    this.loadProject();
  }

  ngOnInit() {
    this.loadProject();
    this.initializeUndoRedo();
    this.sectionId = 0;
    this.sectionComponentId = 0;
    console.log({ formInputs: this.getAllFormInputs() });
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
        console.log("Project loaded (SAVE STATE)!");
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
      console.log("Undo-redo initialized (SAVE STATE)!");
      this.undoRedoService.saveState(this.editList);
    }
  }

  undoRedo(undoRedoEvent: "UNDO" | "REDO") {
    if (undoRedoEvent === "UNDO") {
      this.editList = this.undoRedoService.undo() ?? [];
    } else {
      this.editList =  this.undoRedoService.redo() ?? [];
    }
  }

  dropIntoEdit(event: CdkDragDrop<EditList[], EditList[] | FormInputData[], EditList | FormInputData>): void {
    console.log({ sectionInputs: this.getAllFormInputs() });
    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if(instanceOfFormInputData(event.item.data) && !(event.item.data.data?.id)) {
      const droppedInput: FormInputData = event.item.data;
      if (droppedInput.title === "SECTION") {
        const newSectionId = `section-${++this.sectionId}`;
        const newSectionEdit: EditList = {
          id: newSectionId,
          data: {
            sectionId: newSectionId,
            layout: LayoutEnum.VERTICAL,
            sectionInputs: []
          }
        };
        event.container.data.splice(event.currentIndex, 0, newSectionEdit);
      } else {
        // Create a deep copy of the dropped item with updated ID
        const newItemId = "input-" + (++this.sectionComponentId);
        const newItem: FormInputData = cloneDeep(droppedInput);
        newItem.data!.id = newItemId;
        newItem.data!.sectionId = event.container.id;
        const newInputEdit: EditList = {
          id: newItemId,
          data: newItem
        };
        event.container.data.splice(event.currentIndex, 0, newInputEdit);
      }
    } else if(instanceOfFormInputData(event.item.data)) {
      event.item.data.data!.sectionId = event.container.id;
      const transferredInput: EditList = {
        id: event.item.data.data!.id!,
        data: event.item.data
      };
      event.container.data.splice(event.currentIndex, 0, transferredInput);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
    console.log("Input components modified (SAVE STATE)!");
    this.undoRedoService.saveState(this.editList);

    console.log({ sectionInputs: this.getAllFormInputs() });
  }


  dropIntoSection(event: CdkDragDrop<FormInputData[], EditList[] | FormInputData[], EditList | FormInputData>): void {
    console.log({ sectionInputs: this.getAllFormInputs() });
    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else if(instanceOfFormInputData(event.item.data) && !(event.item.data.data?.id)) {
      const droppedInput: FormInputData = event.item.data;
      // Create a deep copy of the dropped item with updated ID
      const newItemId = "input-" + (++this.sectionComponentId);
      const newItem: FormInputData = cloneDeep(droppedInput);
      newItem.data!.id = newItemId;
      newItem.data!.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, newItem);
    } else if (instanceOfFormInputData(event.item.data)) {
      transferArrayItem(event.previousContainer.data as FormInputData[], event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const transferredInput = event.item.data.data as FormInputData;
      transferredInput.data!.sectionId = event.container.id;
      event.container.data.splice(event.currentIndex, 0, transferredInput);
      event.previousContainer.data.splice(event.previousIndex, 1);
    }
    console.log("Input components modified (SAVE STATE)!");
    this.undoRedoService.saveState(this.editList);

    console.log({ sectionInputs: this.getAllFormInputs() });
  }

  getEditDropListConnectedTo() {
    return this.getSectionIds();
  }

  getSectionDropListConnectedTo(sect: SectionList) {
    return this.getSectionIds().filter(sectionId => sectionId !== sect.sectionId).concat(["sectionDropList"]);
  }

  removeEditComponent(edit: EditList) {
    this.editList = this.editList.filter(e => e.id !== edit.id);
    console.log("Edit component removed (SAVE STATE)!");
    this.undoRedoService.saveState(this.editList);
  }

  removeSectionComponent(sect: SectionList, componentId: string) {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data!.id !== componentId);
    console.log("Input component in section removed (SAVE STATE)!");
    this.undoRedoService.saveState(this.editList);
  }

  getSectionInputStyle(sect: SectionList) {
    let width: number = 0;
    if (sect.sectionInputs.some(edit => instanceOfSectionList(edit.data)) || sect.layout === LayoutEnum.VERTICAL) {
      width = 100;
    } else {
      width = 100 / sect.sectionInputs.length;
    }
    return {
      'width': width.toString() + "%",
    };
  }

  sectionLayoutChange(sect: SectionList) {
    if (sect.layout === LayoutEnum.VERTICAL) {
      sect.layout = LayoutEnum.HORIZONTAL;
    } else {
      sect.layout = LayoutEnum.VERTICAL;
    }
    console.log("Section layout changed (SAVE STATE)!");
    this.undoRedoService.saveState(this.editList);
  }

  isFormInvalid(): boolean {
    return this.getAllFormInputs().length === 0 || this.inputComponents.some(inp => !inp.isValid());
  }
  /**
   * Handles the event when the value of a form input changes.
   * This method updates the corresponding form input's value based on the selection made by the user.
   * @param sect
   * @param event - The event object containing the new value of the form input.
   * @returns {void}
   */
  onValueChanged<D extends InputData<T>, T>(event: D): void {
    console.log("Input component changed/edited (SAVE STATE)!", event.id);
    this.undoRedoService.saveState(this.editList);
  }
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
      this.projectService.update(this.projectId!, project);
    }
  }

  protected readonly instanceOfSectionList = instanceOfSectionList;
  protected readonly instanceOfFormInputData = instanceOfFormInputData;
}
