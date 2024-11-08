import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {Component, inject, Input, OnChanges, OnInit} from '@angular/core';
import {FormInput, Project} from 'src/app/items/project.interface';
import {ProjectService} from 'src/app/services/project.service';
import {UndoRedoService} from 'src/app/services/undo-redo.service';
import {SectionComponent} from 'src/app/shared/components/section/section.component';
import {DatePickerComponent} from "../../shared/components/date-picker/date-picker.component";
import {InputComponent} from "../../shared/components/input/input.component";
import {NumberInputComponent} from "../../shared/components/number-input/number-input.component";
import {PictureInputComponent} from "../../shared/components/picture-input/picture-input.component";
import {SelectComponent} from "../../shared/components/select/select.component";
import {TextareaComponent} from "../../shared/components/textarea/textarea.component";
import {SectionList} from "./interfaces/section-list";
import {LayoutEnum} from "./interfaces/layout-enum";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnChanges {
  private readonly projectService = inject(ProjectService<Project>);
  private readonly undoRedoService = inject(UndoRedoService<FormInput[]>);

  constructor() {}

  @Input() projectId: number | undefined;

  textInputOptions = { component: InputComponent, type: 'text' };
  textInput: string[] = Array(100).fill(this.textInputOptions);
  numberInputOptions = { component: NumberInputComponent, type: 'number' };
  numberInput: string[] = Array(100).fill(this.numberInputOptions);
  dateInputOptions = { component: DatePickerComponent };
  dateInput: string[] = Array(100).fill(this.dateInputOptions);
  textAreaInputOptions = { component: TextareaComponent, textareaPlaceholder: 'text placeholder' };
  textAreaInput: string[] = Array(100).fill(this.textAreaInputOptions);
  pictureInputOptions = { component: PictureInputComponent, fileName: 'fileName' };
  pictureInput: string[] = Array(100).fill(this.pictureInputOptions);
  selectInputOptions = { component: SelectComponent, questionValue: 'Test', answerOptions: ['Option1', 'Option2'] };
  selectInput: string[] = Array(100).fill(this.selectInputOptions);

  sectionInputOptions = { component: SectionComponent};
  sectionInput: string[] = Array(3).fill(this.sectionInputOptions);

  sectionList: SectionList[] = [];
  getSectionIds = (list: SectionList[]) => list.map(sect => sect.sectionId);
  getAllFormInputs = () => this.sectionList.flatMap(sect => sect.sectionInputs);

  @Input() versionNum?: number;

  sectionId!: number;
  sectionComponentId!: number;

  /**
   * Loads project form inputs based on the current project ID and version number.
   * If a project and its form inputs are found, it updates the formInputs array with the project's form inputs.
   * @returns {void}
   */
  private loadProjectFormInputs(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum ?? 1);
      if (project?.formInputs) {
        //FIXME
        // this.formInputs = [...project.formInputs];
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
    this.loadProjectFormInputs();
  }

  ngOnInit() {
    this.loadProjectFormInputs();
    this.initializeUndoRedo();
    this.sectionId = 0;
    this.sectionComponentId = 0;
    console.log({ formInputs: this.getAllFormInputs() });
  }


  /**
   * Handles the drag and drop event for form elements.
   * @param {CdkDragDrop<any[]>} event  - The drag and drop event containing the current state and target of the dragged item.
   * @returns {void}
   *
   * TODO: Avoid using any type for the event parameter.
   */
  drop(event: CdkDragDrop<any[]>): void {
    // console.log({ event, container: event.container });
    // console.log({ itemId: event.item.element.nativeElement.id });
    console.log({ formInputs: this.getAllFormInputs() });

    // Check if the item was moved within the same container
    if (event.previousContainer === event.container) {
      // Move the item within the array
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const inputId: number = event.previousContainer.data[event.previousIndex].id ?? ++this.sectionComponentId;
      // Create a copy of the dropped item with updated ID
      const droppedItem = { ...event.previousContainer.data[event.previousIndex], id: inputId, sectionId: event.container.id };
      // Transfer the item from one container to another
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      // Update the item in the new container with the copied item
      event.container.data[event.currentIndex] = droppedItem;
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
   * TODO: Avoid using any type for the answerValue parameter.
   */
  onValueChanged(sect: SectionList | null, event: {
    questionValue: string;
    answerValue: any;
    descriptionValue: string;
    id: string
  }): void {
    if (sect) {
      const inputValue = {
        question: event.questionValue,
        answer: event.answerValue,
        description: event.descriptionValue,
        id: event.id,
      };

      const index = sect.sectionInputs.findIndex((input) => input.id === event.id);

      if (index !== -1) {
        sect.sectionInputs[index].question = event.questionValue;
        sect.sectionInputs[index].answer = event.answerValue;
        sect.sectionInputs[index].description = event.descriptionValue;
        this.undoRedoService.saveState(this.getAllFormInputs());

        console.log({ formInputs: this.getAllFormInputs() });
      } else {
        console.error('Input not found');
      }
    }
  }

  /**
   * Saves the current state of the form inputs to the project.
   * It then calls the project service to persist the updated project data.
   * @returns {void}
   */
  saveForm(): void {
    const project = this.projectService.searchData(this.projectId!)[0];
    if (project) {
      project.formInputs = project.formInputs || [];
      const existingIds = new Set(project.formInputs.map((input) => input.id));
      for (const input of this.getAllFormInputs()) {
        if (existingIds.has(input.id)) {
          const index = project.formInputs.findIndex((existingInput) => existingInput.id === input.id);
          if (index !== -1) {
            project.formInputs[index] = input;
          }
        } else {
          project.formInputs.push(input);
          existingIds.add(input.id);
        }
      }
      this.projectService.update(this.projectId!, project);
    }
  }

  onFormInputsChange(updatedFormInputs: any[]): void {
    //FIXME
    // this.formInputs = updatedFormInputs;
  }

  removeComponent(sect: SectionList, componentId: string) {
    sect.sectionInputs = sect.sectionInputs.filter((input) => input.id !== componentId);
  }

  sectionDrop($event: CdkDragDrop<any[]>) {
    const itemId = $event.item.element.nativeElement.id;
    // Check if the item is a section or belongs to a cdk-drop-list
    if (!itemId.includes("section")) {
      const newItemId = `section${++this.sectionId}`;
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
    const width = sect.layout === LayoutEnum.HORIZONTAL ? (100 / sect.sectionInputs.filter((input) => input.sectionId === sect.sectionId).length) : 100;
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
