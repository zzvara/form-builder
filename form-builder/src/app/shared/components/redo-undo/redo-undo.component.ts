import { Component } from '@angular/core';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: ['./redo-undo.component.css']
})
export class RedoUndoComponent {
  inputValue: string = '';
  inputStates: string[] = [];
  undoStats: number = 0;

  onChanges(change:any) {
    this.inputStates.push(change);
    this.undoStats = 0;
  }

  undo() {
    this.undoStats++;
    this.inputValue = this.inputStates[this.inputStates.length - (this.undoStats + 1)];
  }

  redo() {
    if (this.undoStats > 0) this.undoStats--;
    if (this.undoStats >= 0)
    this.inputValue = this.inputStates[this.inputStates.length - (this.undoStats + 1)];
  }
}




