import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Project, ProjectType } from '../../../items/project.interface';
import { ProjectService } from '../../../services/project.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.css']
})
export class InfoPageComponent implements OnInit {

  @Input() page?: number;
  @Output() setPage = new EventEmitter<number>();

  project = {
  id: 0,
  title: '',
  description: '',
  type: ProjectType.QUESTIONNAIRE,
  time_chechkbox: false,
  time_limit: 0,
  deadline: '',
  created: new Date().toISOString().split('T')[0],
  modified: new Date().toISOString().split('T')[0],
  questions: []
   };

  hasdeadline = false;
  haslimit = false;

  ngOnInit(): void {
    // kikeresés
    //ha nincs
    this.updateForm();
  }

  form = new FormGroup({
    title: new FormControl(this.project?.title),
    description: new FormControl(this.project?.description),
    type: new FormControl(this.project?.type == ProjectType.TEST),
    deadline: new FormControl(this.project?.deadline),
    haslimit: new FormControl(this.project?.time_chechkbox),
    limit: new FormControl(this.project?.time_limit)
  });

  setDeadline() {
    this.hasdeadline = !this.hasdeadline;
  }

  setLimit() {
    this.haslimit = !this.haslimit;
    this.project.time_chechkbox = this.haslimit;

  }

  updateForm() {
    if (this.project) {
      this.project.title = this.form.controls['title'].value!;
      this.project.description = this.form.controls['description'].value!;
      this.project.type = this.form.controls['type'].value! ? ProjectType.TEST : ProjectType.QUESTIONNAIRE;
      this.project.deadline = this.form.controls['deadline'].value!;
      this.project.time_chechkbox = this.form.controls['haslimit'].value!;
      if (this.project.time_chechkbox) {
        this.project.time_limit = this.form.controls['limit'].value!;
      }
    }
  }

  submitForm() {
    // mentés
    // ha sikeres
    this.page! += 1;
    this.onsetPage(this.page!);
  }

  onsetPage(page: number): void {
    this.setPage.emit(page);
  }
}
