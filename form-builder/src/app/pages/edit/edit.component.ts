import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { SectionComponent } from 'src/app/shared/components/section/section.component';
import { Router } from '@angular/router';
import { UndoRedoService } from 'src/app/services/undo-redo.service';
import { answerType } from 'src/app/shared/answerType.interface';
import { v4 as uuidv4 } from 'uuid';
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
  dateInputOptions = { component: 'app-date-picker', questionValue: 'Test' };
  dateInput: string[] = Array(100).fill(this.dateInputOptions);
  textAreaInputOptions = { component: 'app-textarea', questionValue: 'Test', textareaPlaceholder: 'text placeholder' };
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
  formInputs: any[] = [];
  sectionList: any[] = ['buildedForm'];

  ngOnInit() {
    // console.log({ list: this.sectionList });
    // console.log("id", this.projectId);
  }

  drop(event: CdkDragDrop<any[]>) {
    const itemId = uuidv4();

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.undeoRedoService.dragEvent(event);
    } else {
      const droppedItem = { ...event.previousContainer.data[event.previousIndex], id: itemId };
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      event.container.data[event.currentIndex] = droppedItem;
      this.undeoRedoService.dragEvent(event);
    }

    console.log({ formInputs: this.formInputs });
  }

  onValueChanged(event: { questionValue: string; answerValue: answerType; id: string }) {
    const inputValue = {
      question: event.questionValue,
      answer: event.answerValue.answerValue,
      id: event.id,
    };

    const index = this.formInputs.findIndex((input) => input.id === event.id);

    if (index !== -1) {
      this.formInputs[index].question = event.questionValue;
      this.formInputs[index].answer = event.answerValue.answerValue;

      console.log({ formInputs: this.formInputs });
    } else {
      console.error('Input not found');
    }
  }

  saveForm() {
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
