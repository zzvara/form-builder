import {CdkDragDrop, copyArrayItem, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {ProjectService} from 'src/app/services/project.service';
import {UndoRedoService} from 'src/app/services/undo-redo.service';
import {SidebarData} from "../../shared/components/sidebar/interfaces/sidebar-data";
import {FormInputData} from "../../shared/interfaces/form-input-data";
import {InputData} from "../../shared/interfaces/input-data";
import {getSideBarData} from "./config/edit-data-config";
import {LayoutEnum} from "./interfaces/layout-enum";
import {SectionList} from "./interfaces/section-list";
import { Project } from 'src/app/interfaces/project';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges {
  private readonly projectService = inject(ProjectService<Project>);
  private readonly undoRedoService = inject(UndoRedoService<SectionList[]>);

  constructor() {}

  @Input() projectId: number | undefined;
  @Input() versionNum?: number;

  sideBarData: SidebarData[] = getSideBarData(this);

  sectionList: SectionList[] = [];
  getSectionIds = () => this.sectionList.map(sect => sect.sectionId);
  getAllFormInputs = () => this.sectionList.flatMap(sect => sect.sectionInputs);

  sectionId!: number;
  sectionComponentId!: number;

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
        this.undoRedoService.saveState(this.getAllFormInputs());
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
      this.undoRedoService.saveState(this.getAllFormInputs());
    }
  }

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
   * Handles the drag and drop event for form elements.
   * @param {CdkDragDrop<any[]>} event  - The drag and drop event containing the current state and target of the dragged item.
   * @returns {void}
   */
  drop(event: CdkDragDrop<FormInputData<any, any>[], FormInputData<any, any>[], FormInputData<any, any>>): void {
    // console.log({ event, container: event.container });
    // console.log({ itemId: event.item.element.nativeElement.id });
    console.log({ formInputs: this.getAllFormInputs() });

    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const droppedInput: FormInputData<any, any> = event.item.data;
      // Check if already in a section (has id)
      if (droppedInput.data.id) {
        droppedInput.data.sectionId = event.container.id;

        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      } else {
        // Create a deep copy of the dropped item with updated ID
        const newItem: FormInputData<any, any> = {...droppedInput};
        newItem.data = structuredClone(droppedInput.data);
        newItem.data.id = "input-" + (++this.sectionComponentId);
        newItem.data.sectionId = event.container.id;

        // Copy the item from a temporary container to the given section's (not very nice :( )
        copyArrayItem([newItem], event.container.data, 0, event.currentIndex);
      }
    }
    this.undoRedoService.saveState(this.getAllFormInputs());

    console.log({ formInputs: this.getAllFormInputs() });
  }

  /**
   * Handles the event when the value of a form input changes.
   * This method updates the corresponding form input's value based on the selection made by the user.
   * @param sect
   * @param event - The event object containing the new value of the form input.
   * @returns {void}
   *
   * FIXME - It just doesnt work now... sorry :(
   */
  onValueChanged<D extends InputData<T>, T>(sect: SectionList | null, event: D): void {
    console.log("CHANGED! :D:D:D:D:D:D:D:D:D:D");
    //FIXME:
    // if (sect) {
    //   const inputValue = {
    //     question: event.questionValue,
    //     answer: event.answerValue,
    //     description: event.descriptionValue,
    //     id: event.id,
    //   };
    //
    //   const index = sect.sectionInputs.findIndex((input) => input.data.id === event.id);
    //
    //   if (index !== -1) {
    //     sect.sectionInputs[index].data.question = event.questionValue;
    //     sect.sectionInputs[index].data.answer = event.answerValue;
    //     sect.sectionInputs[index].data.description = event.descriptionValue;
    //     this.undoRedoService.saveState(this.getAllFormInputs());
    //
    //     console.log({ formInputs: this.getAllFormInputs() });
    //   } else {
    //     console.error('Input not found');
    //   }
    // }
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
  
  onFormInputsChange(updatedFormInputs: any[]): void {
    //FIXME
    // this.formInputs = updatedFormInputs;
  }

  removeComponent(sect: SectionList, componentId: string) {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.data.id !== componentId);
  }

  sectionDrop($event: CdkDragDrop<any[]>) {
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
  }

  sectionRemove(sect: SectionList) {
    this.sectionList = this.sectionList.filter((section) => section !== sect);
  }

  getSectionInputStyle(sect: SectionList) {
    const width = sect.layout === LayoutEnum.HORIZONTAL ?
      (100 / sect.sectionInputs.filter((input) => input.data.sectionId === sect.sectionId).length) : 100;
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
  }
}
