import { Component } from '@angular/core';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: ['./redo-undo.component.css'],
})
export class RedoUndoComponent {
  canUndo = false;
  canRedo = false;
  actionCount = 0;
}
