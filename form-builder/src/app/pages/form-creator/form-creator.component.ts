import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Questionnaire, ProjectType } from '../../items/questionnaire.interface'

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

  onNavigateBack() {
    this.router.navigate(['/dashboard']);
  }

  submitForm() {
    //TODO:elmenteni
    console.log(this.questionnaire);
  }
}
