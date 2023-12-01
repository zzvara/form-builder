import { Component } from '@angular/core';
import { UndoStack } from '@grapecity/wijmo.undo';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: ['./redo-undo.component.css'],
})
export class RedoUndoComponent {
  undoStack!: UndoStack;
  canUndo = false;
  canRedo = false;
  actionCount = 0;

  // enable undo/redo for the form
  // use ngAfterViewInit to ensure all controls
  // have been initalized (ngOnInit is too soon)
  ngAfterViewInit() {
    this.undoStack = new UndoStack('#undoable-form', {
      maxActions: 50,
      stateChanged: (s: UndoStack) => {
        this.canUndo = s.canUndo;
        this.canRedo = s.canRedo;
        this.actionCount = s.actionCount;
      },
    });
  }
}
