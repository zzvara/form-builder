import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {ProjectService} from 'src/app/services/project.service';
import {UndoRedoService} from 'src/app/services/undo-redo.service';
import {SidebarData} from "../../shared/components/sidebar/interfaces/sidebar-data";
import {FormInputData} from "../../shared/interfaces/form-input-data";
import {InputData} from "../../shared/interfaces/input-data";
import {getSideBarData} from "./config/edit-data-config";
import {LayoutEnum} from "./interfaces/layout-enum";
import {identifySectionList, SectionList} from "./interfaces/section-list";
import {Project} from 'src/app/interfaces/project';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges {
  private readonly projectService: ProjectService<Project> = inject(ProjectService);
  private readonly undoRedoService: UndoRedoService<SectionList[]> = inject(UndoRedoService);
  protected readonly identifySectionList = identifySectionList;

  @Input() projectId: number | undefined;
  @Input() versionNum?: number;

  sideBarData: SidebarData[] = getSideBarData(this);

  sectionList: SectionList[] = [];
  getSectionIds = () => this.sectionList.map(sect => sect.sectionId);
  getAllFormInputs = () => this.sectionList.flatMap(sect => sect.sectionInputs);

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
      if (project?.sectionList) {
        this.sectionList = project.sectionList.map(section => ({
          sectionId: `${section.sectionId}`,
          layout: LayoutEnum.VERTICAL,
          sectionInputs: section.sectionInputs
        }));
        console.log("Project loaded (SAVE STATE)!");
        this.undoRedoService.saveState(this.sectionList);
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
      this.undoRedoService.saveState(this.sectionList);
    }
  }

  undoRedo(undoRedoEvent: "UNDO" | "REDO") {
    if (undoRedoEvent === "UNDO") {
      this.sectionList = this.undoRedoService.undo() ?? [];
    } else {
      this.sectionList =  this.undoRedoService.redo() ?? [];
    }
  }

  /**
   * Handles the drag and drop event for form elements.
   * @param {CdkDragDrop<any[]>} event  - The drag and drop event containing the current state and target of the dragged item.
   * @returns {void}
   */
  drop(event: CdkDragDrop<FormInputData[], FormInputData[], FormInputData>): void {
    console.log({ sectionInputs: this.getAllFormInputs() });

    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const droppedInput: FormInputData = event.item.data;
      // Check if already in a section (has id)
      if (droppedInput.data?.id) {
        droppedInput.data.sectionId = event.container.id;

        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      } else {
        // Create a deep copy of the dropped item with updated ID
        const newItem: FormInputData = {...droppedInput};
        newItem.data = structuredClone(droppedInput.data);
        newItem.data!.id = "input-" + (++this.sectionComponentId);
        newItem.data!.sectionId = event.container.id;

        // Copy the item from a temporary container to the given section's (not very nice :( )
        copyArrayItem([newItem], event.container.data, 0, event.currentIndex);
      }
    }
    console.log("Input component added (SAVE STATE)!");
    this.undoRedoService.saveState(this.sectionList);

    console.log({ sectionInputs: this.getAllFormInputs() });
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
    this.undoRedoService.saveState(this.sectionList);
  }

  /**
   * Saves the current state of the form inputs to the project.
   * It then calls the project service to persist the updated project data.
   * @returns {void}
   */
  saveForm(): void {
    const project = this.projectService.searchData(this.projectId!)[0];
    if (project) {
      project.sectionList = [];
      for (const section of this.sectionList) {
        project.sectionList.push({
          sectionId: section.sectionId,
          layout: section.layout,
          sectionInputs: section.sectionInputs
        });
      }
      this.projectService.update(this.projectId!, project);
    }
  }

  removeComponent(sect: SectionList, componentId: string) {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data!.id !== componentId);
    console.log("Input component in section removed (SAVE STATE)!");
    this.undoRedoService.saveState(this.sectionList);
  }

  sectionDrop($event: CdkDragDrop<SectionList[]>) {
    const itemId = $event.item.element.nativeElement.id;
    // Check if the item is a section or belongs to a cdk-drop-list
    if (!itemId.includes("section")) {
      const newItemId = `section-${++this.sectionId}`;
      const newSection: SectionList[] = [{
        sectionId: newItemId,
        layout: LayoutEnum.VERTICAL,
        sectionInputs: []
      }];
      transferArrayItem(
        newSection,
        this.sectionList,
        $event.previousIndex,
        $event.currentIndex,
      );
      console.log('section list in edit after drag', { sectionList: this.sectionList, itemId });
    } else {
      moveItemInArray(this.sectionList, $event.previousIndex, $event.currentIndex);
    }
    console.log("Section added (SAVE STATE)!");
    this.undoRedoService.saveState(this.sectionList);
  }

  sectionRemove(sect: SectionList) {
    this.sectionList = this.sectionList.filter((section) => section !== sect);
    console.log("Section removed (SAVE STATE)!");
    this.undoRedoService.saveState(this.sectionList);
  }

  getSectionInputStyle(sect: SectionList) {
    const width = sect.layout === LayoutEnum.HORIZONTAL ?
      (100 / sect.sectionInputs.filter((input) => input.data!.sectionId === sect.sectionId).length) : 100;
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
    this.undoRedoService.saveState(this.sectionList);
  }
}
