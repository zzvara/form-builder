import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormCreator, FormCreatorVersion } from './form-creator.model';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.css'],
})
export class FormCreatorComponent implements OnInit {
  constructor(private readonly router: Router) {}
  form: FormGroup = new FormGroup({});

  formCreator: FormCreator = {
    id: '',
    name: '',
    description: '',
    timeLimit: 0,
    availableUntil: new Date(),
    createdDate: '',
    modifiedDate: '',
  };

  formCreators: FormCreator[] = [];

  editMode: boolean = false;
  editedField: any;

  selectedVersion: number = -1;

  editField(field: any) {
    this.editMode = true;
    this.editedField = { ...field };
  }

  saveFieldChanges() {
    this.editMode = false;
    const index = this.formCreators.findIndex((field) => field.id === this.editedField.id);

    if (index !== -1) {
      const updatedField = { ...this.editedField };

      if (!updatedField.versions) {
        updatedField.versions = [];
      }

      const newVersion: FormCreatorVersion = { ...updatedField, timestamp: new Date().getTime() };
      updatedField.versions.push(newVersion);

      this.formCreators[index] = updatedField;
    }

    this.editedField = null;
  }

  cancelEdit() {
    this.editMode = false;
    this.editedField = null;
  }

  saveFormField() {
    const timestamp = new Date().getTime();
    const newField: FormCreator = {
      name: this.formCreator.name,
      description: this.formCreator.description,
      timeLimit: this.formCreator.timeLimit,
      availableUntil: this.formCreator.availableUntil,
      createdDate: this.formCreator.createdDate,
      modifiedDate: this.formCreator.modifiedDate,
      id: this.generateUniqueID(),
      versions: [{ ...this.formCreator, timestamp }],
    };

    this.formCreators.push(newField);
  }

  revertToVersion(field: FormCreator, selectedVersion: number) {
    if (field.versions && field.versions.length > selectedVersion) {
      const versionToRevert = field.versions[selectedVersion];
      field.name = versionToRevert.name;
      field.description = versionToRevert.description;
      field.timeLimit = versionToRevert.timeLimit;
      field.availableUntil = versionToRevert.availableUntil;
    }
  }

  private generateUniqueID(): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000) + 1;
    const uniqueID = `${timestamp}-${random}`;
    return uniqueID;
  }

  ngOnInit() {
    this.form = new FormBuilder().group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      checkbox: [false],
      number: [null],
      date: ['', Validators.required],
      createdDate: [new Date().toISOString().split('T')[0]],
      modifiedDate: [new Date().toISOString().split('T')[0]],
    });
  }

  onNavigateBack() {
    this.router.navigate(['/dashboard']);
  }

  submitForm() {
    //TODO: itt kell elmenteni
    const formValue = this.form.value;
    console.log(formValue);
  }
}
