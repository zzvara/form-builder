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
  formInputs: any[] = [];
  sectionList: any[] = ['buildedForm'];

  @Input() versionNum?: number;
  ngOnChanges() {
    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
      if (project && project.formInputs) {
        this.formInputs = [...project.formInputs];
      }
    }
  }

  ngOnInit() {
    console.log('editcomponent', { list: this.sectionList });

    if (this.projectId !== undefined) {
      const project = this.projectService.getProjectVersion(this.projectId, this.versionNum || 1);
      if (project && project.formInputs) {
        this.formInputs = [...project.formInputs];
      }
    }
  }

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  drop(event: CdkDragDrop<any[]>) {
    console.log({ event, container: event.container });
    console.log({ itemId: event.item.element.nativeElement.id });
    const itemId = event.item.element.nativeElement.id;
    if (itemId.includes('section') || itemId.includes('cdk-drop-list')) {
      const newItemId = `section${this.randomIntFromInterval(1, 100)}`;
      this.sectionList.push(itemId);
      console.log('section list in edit after drag', { sectionList: this.sectionList, itemId });
    } else {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.undeoRedoService.dragEvent(event);
      } else {
        const droppedItem = { ...event.previousContainer.data[event.previousIndex], id: itemId };
        transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
        event.container.data[event.currentIndex] = droppedItem;
        this.undeoRedoService.dragEvent(event);
      }
    }

    console.log({ formInputs: this.formInputs });
  }

  onValueChanged(event: { questionValue: string; answerValue: any; descriptionValue: string; id: string }) {
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
