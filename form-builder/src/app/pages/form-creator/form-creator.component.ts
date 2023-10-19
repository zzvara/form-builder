import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-creator',
  templateUrl: './form-creator.component.html',
  styleUrls: ['./form-creator.component.css']
})

export class FormCreatorComponent implements OnInit {
  constructor(private readonly router: Router) {}
  form: FormGroup = new FormGroup({});

  ngOnInit() {
    this.form = new FormBuilder().group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      checkbox: [false],
      number: [null],
      date: ['', Validators.required],
      createdDate: [new Date().toISOString().split('T')[0]],
      modifiedDate: [new Date().toISOString().split('T')[0]]
    });
  }

  onNavigateBack() {
    this.router.navigate(['/dashboard']);
  }

  submitForm() {
      //TODO: itt kell elmenteni
  }
}
