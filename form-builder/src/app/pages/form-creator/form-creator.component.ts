import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Questionnaire } from '../../items/questionnaire/questionnaire.interface';
import { ProjectType } from '../../items/project.interface';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.css'],
})
export class FormCreatorComponent implements OnInit {
  constructor(private readonly router: Router) {
    this.projectId = 0;
  }

  projectId: number;
  currentVersionNum?: number;

  setProjectId(id: number) {
    this.projectId = id;
  }

  setVersionNum(versionNum: number) {
    this.currentVersionNum = versionNum;
  }

  ngOnInit() {}

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
