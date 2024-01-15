import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent {
  constructor(private readonly router: Router, private undeoRedoService: UndoRedoService) {}

  onNavigateBack() {
    this.router.navigate(['/dashboard']);
  }

  onValueChange(event: any) {
    this.undeoRedoService.changeEvent(event);
  }
}
