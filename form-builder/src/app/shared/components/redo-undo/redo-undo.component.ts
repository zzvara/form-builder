import { Component, OnInit } from '@angular/core';
import { UndoRedoService } from 'src/app/services/undo-redo.service';

@Component({
  selector: 'app-redo-undo',
  templateUrl: './redo-undo.component.html',
  styleUrls: ['./redo-undo.component.css'],
})
export class RedoUndoComponent implements OnInit {
  constructor(private undoRedoService: UndoRedoService) {}
  canUndo = this.undoRedoService.canUndo;
  canRedo = this.undoRedoService.canRedo;
  undoActions = this.undoRedoService.undoActions;
  redoActions = this.undoRedoService.redoActions;

  ngOnInit(): void {
    if (this.undoActions === null) {
      localStorage.setItem('undoActions', JSON.stringify([]));
    }
    if (this.redoActions === null) {
      localStorage.setItem('redoActions', JSON.stringify([]));
    }
    console.log({ undoActions: this.undoActions, redoActions: this.redoActions });
  }

  undoBtn() {
    console.log(this.undoActions);
    const length = this.undoActions.length;
    const lastAction = this.undoActions[length - 1];
    const id = lastAction.id;

    const element = document.getElementById(id);
    let position;
    if (typeof lastAction.action === 'object') {
      position = lastAction.action;
    }
    if (element && position) {
      element.style.position = 'absolute';
      element.style.left = position.x + 'px';
      element.style.top = position.y + 'px';
    }

    let value;
    if (typeof lastAction.action === 'string') {
      value = lastAction.action;
    }
    if (element && (value || value === '')) {
      console.log('change value', element.textContent, element);

      element.textContent = value;
    }

    this.undoRedoService.undo();
    if (this.undoActions.length > 0) {
      this.canUndo = true;
    } else {
      this.canUndo = false;
    }
    if (this.redoActions.length > 0) {
      this.canRedo = true;
    } else {
      this.canRedo = false;
    }
    console.log('undo button works!', { undoActions: this.undoActions, redoActions: this.redoActions });
  }

  redoBtn() {
    console.log(this.redoActions);
    const length = this.redoActions.length;
    const lastAction = this.redoActions[length - 1];
    const id = lastAction.id;

    const element = document.getElementById(id);
    let position;
    if (typeof lastAction.action === 'object') {
      position = lastAction.action;
    }
    if (element && position) {
      element.style.position = 'absolute';
      element.style.left = position.x + 'px';
      element.style.top = position.y + 'px';
    }

    let value;
    if (typeof lastAction.action === 'string') {
      value = lastAction.action;
    }
    if (element && value) {
      element.setAttribute('value', value);
    }

    this.undoRedoService.redo();
    if (this.undoActions.length > 0) {
      this.canUndo = true;
    } else {
      this.canUndo = false;
    }
    if (this.redoActions.length > 0) {
      this.canRedo = true;
    } else {
      this.canRedo = false;
    }
    console.log('undo button works!', { undoActions: this.undoActions, redoActions: this.redoActions });
  }
}
