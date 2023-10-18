import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  constructor(private readonly router: Router) {}

  onNavigateBack() {
    this.router.navigate(['/dashboard']);
  }
}
