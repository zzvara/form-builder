import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Questionnaire } from '../../items/questionnaire/questionnaire.interface';
import { ProjectType } from '../../items/project.interface';

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
      time_chechkbox: false,
      time_limit: 0,
      date: '',
      created: new Date().toISOString().split('T')[0],
      modified: new Date().toISOString().split('T')[0]
    };
  }

  page = 0;

  setPage(p: number) {
    if (p <= 2) {
      this.page = p;
    }
  }

  nextPage() {
    if (this.page < 2) {
      this.page += 1;
    }
  }
  toInfoPage() {
    this.page = 0;
  }
  toCompPage() {
    this.page = 1;
  }
  toAnswPage() {
    this.page = 2;
  }

  
}
