import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { SectionComponent } from 'src/app/shared/components/section/section.component';
import { Router } from '@angular/router';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  constructor(private readonly router: Router, private undeoRedoService: UndoRedoService,private sectionComponent: SectionComponent) {}
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
    console.log({ list: this.sectionList });
  }

  drop(event: CdkDragDrop<string[]>) {
    console.log({ event, container: event.container });
    console.log({ itemId: event.item.element.nativeElement.id });
    const itemId = event.item.element.nativeElement.id;
    if (itemId.includes('section') || itemId.includes('cdk-drop-list')) {
      this.sectionList.push(itemId);
      console.log({ sectionList: this.sectionList, itemId });
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.undeoRedoService.dragEvent(event);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.undeoRedoService.dragEvent(event);
    }
  }

  onValueChange(event: any) {
    this.undeoRedoService.changeEvent(event);
  }
}
