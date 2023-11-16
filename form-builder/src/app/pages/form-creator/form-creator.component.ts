import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Questionnaire, ProjectType } from '../../items/questionnaire.interface';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.css']
})

export class FormCreatorComponent implements OnInit {
  constructor(private readonly router: Router) {}
  questionnaire!: Questionnaire;

  ngOnInit() {
    this.questionnaire = {
      id: 0,
      title: '',
      description: '',
      type: ProjectType.QUESTIONNAIRE,
      timeChechkbox: false,
      timeLimit: 0,
      date: '',
      created: new Date().toISOString().split('T')[0],
      modified: new Date().toISOString().split('T')[0]
    };
  }

  todaysDate = new Date();
  hasdeadline = false;
  haslimit = false;

  form = new FormGroup({
    title: new FormControl(),
    description: new FormControl(),
    type: new FormControl(),
    hasdeadline: new FormControl(this.hasdeadline),
    deadline: new FormControl(),
    haslimit: new FormControl(this.haslimit),
    limit: new FormControl()
  });

  setdeadline() { this.hasdeadline = !this.hasdeadline; }
  setlimit() { this.haslimit = !this.haslimit; }

  onNavigateBack() {
    this.router.navigate(['/dashboard']);
  }

  submitForm() {
    //TODO:elmenteni
    console.log(this.questionnaire);
    console.log(this.form.value);
  }
}
