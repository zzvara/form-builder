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
  selectInputOptions = { component: 'app-select', questionValue: 'Test' };
  selectInput: string[] = Array(100).fill(this.selectInputOptions);
  formInputs: any[] = [];

  //The sectionId represents the id of the current section and the sectionList array represents the sections that can contain formInputs
  //But in reality this does NOT work. The sectionList array is updated when we drag a new section to the canvas, but when we try to drag
  //a component (that is not a section) into the newly added sections it does NOT accept it, and we can only drag form elements into
  // I will present what I did so far to achieve the current status of the task
  // 1) Created this folder, and in the html file (section.component.html) I copy and pasted the logic behing the buildedForm section
  // the buildedForm section is the root section that is there after the page loaded. In this one section we can drag any of the form elements
  // without any issue.
  // 2) After creating the html logic I implemented the drag logic, that is the drop() function in this file
  // this function checks if the item (which we want to drag) contains 'section' if yes, it will be added to the sectionList array
  // --> this is the point where after this drag we SHOULD be able to drag a new form element into this new section (let's call it section1)
  // in reality we get a warning message on the console that "there is no dropList with id section1".
  // That is the current process, the involved files are the following:
  // - section.component.ts
  // - section.component.html
  // - edit.component.ts
  // - edit.component.html
  //I left the logs for easier understanding of current status

  //drag-drop.mjs:3438 CdkDropList could not find connected drop list with id "section38" --> this is the exact warning I get

  //There is already a section (which I created) after the page loaded as in the current version it does NOT work without that being added there
  // This part can be found in edit.component.html line 169-173 (in current version). Without it seemingly the section is added to the
  // sectionList but it does NOT display the section.

  @Input() sectionId?: string;
  @Input() sectionList: any[] = [];

  ngOnInit() {
    // JSON.stringify(this.sectiondId);
    // console.log('Section component  ',{ sectiondId: this.sectiondId });
    // console.log('section component',{ list: this.sectionList });
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
