import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.css'],
})
export class SectionComponent {
  textInputOptions = { component: 'app-text-input', type: 'text' };
  textInput: string[] = Array(100).fill(this.textInputOptions);
  numberInputOptions = { component: 'app-number-input', type: 'number' };
  numberInput: string[] = Array(100).fill(this.numberInputOptions);
  dateInputOptions = { component: 'app-date-picker' };
  dateInput: string[] = Array(100).fill(this.dateInputOptions);
  textAreaInputOptions = { component: 'app-textarea', questionValue: 'Test', textareaPlaceholder: 'text placeholder' };
  textAreaInput: string[] = Array(100).fill(this.textAreaInputOptions);
  pictureInputOptions = { component: 'app-picture-input', fileName: 'fileName' };
  pictureInput: string[] = Array(100).fill(this.pictureInputOptions);
  selectInputOptions = { component: 'app-select', questionValue: 'Test', answerOptions: ['Option1', 'Option2'] };
  selectInput: string[] = Array(100).fill(this.selectInputOptions);
  formInputs: any[] = [];

  randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  @Input() sectiondId: string = `section${this.randomIntFromInterval(1, 100)}`;
  @Input() sectionList: any[] = ['buildedForm', this.sectiondId];

  ngOnInit() {
    JSON.stringify(this.sectiondId);
    console.log('Section component  ',{ sectiondId: this.sectiondId });
    console.log('section component',{ list: this.sectionList });
  }

  drop(event: CdkDragDrop<string[]>) {
    const itemId = event.item.element.nativeElement.id;
    if (itemId.includes('section') || itemId.includes('cdk-drop-list')) {
      this.sectionList.push(itemId);
      console.log({ sectionList: this.sectionList, itemId });
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
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
}
