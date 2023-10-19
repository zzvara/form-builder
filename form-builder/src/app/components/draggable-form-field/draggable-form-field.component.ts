import { Component } from '@angular/core';
import { DraggableFormField } from './draggable-form-field.model';

@Component({
  selector: 'app-draggable-form-field',
  templateUrl: './draggable-form-field.component.html',
  styleUrls: ['./draggable-form-field.component.css'],
})
export class DraggableFormFieldComponent {
  formField: DraggableFormField = {
    variableName: '',
    question: '',
    condition: '',
    isRequired: false,
    id: '',
  };

  formFields: DraggableFormField[] = [];

  saveFormField() {
    this.formFields.push({
      variableName: this.formField.variableName,
      question: this.formField.question, 
      condition: this.formField.condition,
      isRequired: this.formField.isRequired,
      id: this.generateUniqueID(),
    });    
  }

  private generateUniqueID(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000) + 1;
    const uniqueID = `${timestamp}-${random}`;
    return uniqueID;
  }
}
