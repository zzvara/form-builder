import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { SectionComponent } from 'src/app/shared/components/section/section.component';
import { Router } from '@angular/router';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { ProjectService } from 'src/app/services/project.service';
import { Project } from 'src/app/items/project.interface';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  constructor(
    private readonly router: Router,
    private undeoRedoService: UndoRedoService,
    private sectionComponent: SectionComponent,
    private projectService: ProjectService<Project>
  ) {}
  @Input() projectId: number | undefined;

  textInputOptions = { component: 'app-text-input', type: 'text' };
  textInput: string[] = Array(100).fill(this.textInputOptions);
  numberInputOptions = { component: 'app-number-input', type: 'number' };
  numberInput: string[] = Array(100).fill(this.numberInputOptions);
  dateInputOptions = { component: 'app-date-picker' };
  dateInput: string[] = Array(100).fill(this.dateInputOptions);
  textAreaInputOptions = { component: 'app-textarea', textareaPlaceholder: 'text placeholder' };
  textAreaInput: string[] = Array(100).fill(this.textAreaInputOptions);
  pictureInputOptions = { component: 'app-picture-input', fileName: 'fileName' };
  pictureInput: string[] = Array(100).fill(this.pictureInputOptions);
  selectInputOptions = { component: 'app-select', questionValue: 'Test', answerOptions: ['Option1', 'Option2'] };
  selectInput: string[] = Array(100).fill(this.selectInputOptions);
  sectionInputOptions = {
    component: 'app-section',
    sectionId: this.sectionComponent.sectiondId,
  };
  sectionInput: string[] = Array(3).fill(this.sectionInputOptions);
  // TODO: Avoid using any type for the formInputs/sectionList array.
  formInputs: any[] = [];
  sectionList: any[] = ['buildedForm'];

  @Input() versionNum?: number;

  /**
   * Loads project form inputs based on the current project ID and version number.
   * If a project and its form inputs are found, it updates the formInputs array with the project's form inputs.
   * @returns {void}
   */
  private loadProjectFormInputs(): void {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
      if (project && project.formInputs) {
        this.formInputs = [...project.formInputs];
      }
    }
  }

  ngOnChanges() {
    this.loadProjectFormInputs();
  }

  ngOnInit() {
    this.loadProjectFormInputs();
  }

  /**
   * Generates a random integer between two specified values.
   * @param {number} min - The minimum value in the range.
   * @param {number} max - The maximum value in the range.
   * @returns {number} A random integer between min and max.
   */
  randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
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
    const itemId = event.item.element.nativeElement.id;
    // Check if the item is a section or belongs to a cdk-drop-list
    if (itemId.includes('section') || itemId.includes('cdk-drop-list')) {
      const newItemId = `section${this.randomIntFromInterval(1, 100)}`;
      this.sectionList.push(newItemId);
      console.log('section list in edit after drag', { sectionList: this.sectionList, itemId });
    } else {
      // Check if the item was moved within the same container
      if (event.previousContainer === event.container) {
        // Move the item within the array
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        // Record the drag event for undo/redo functionality
        this.undeoRedoService.dragEvent(event);
      } else {
        // Create a copy of the dropped item with updated ID
        const droppedItem = { ...event.previousContainer.data[event.previousIndex], id: itemId };
        // Transfer the item from one container to another
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        // Update the item in the new container with the copied item
        event.container.data[event.currentIndex] = droppedItem;
        // Record the drag event for undo/redo functionality
        this.undeoRedoService.dragEvent(event);
      }
    }

    console.log({ formInputs: this.formInputs });
  }

  /**
   * Handles the event when the value of a form input changes.
   * This method updates the corresponding form input's value based on the selection made by the user.
   * @param event - The event object containing the new value of the form input.
   * @param index - The index of the form input in the formInputs array that needs to be updated.
   * @returns {void}
   * 
   * TODO: Avoid using any type for the answerValue parameter.
   */
  onValueChanged(event: { questionValue: string; answerValue: any; descriptionValue: string; id: string }): void {
    const inputValue = {
      question: event.questionValue,
      answer: event.answerValue,
      description: event.descriptionValue,
      id: event.id,
    };

    const index = this.formInputs.findIndex((input) => input.id === event.id);

    if (index !== -1) {
      this.formInputs[index].question = event.questionValue;
      this.formInputs[index].answer = event.answerValue;
      this.formInputs[index].description = event.descriptionValue;

      console.log({ formInputs: this.formInputs });
    } else {
      console.error('Input not found');
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
      for (const input of this.formInputs) {
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
}
