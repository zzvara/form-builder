import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
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
  @Input() formInputs: any[] = [];

  ngOnInit(): void {
    if (this.undoActions === null) {
      localStorage.setItem('undoActions', JSON.stringify([]));
    }
    if (this.redoActions === null) {
      localStorage.setItem('redoActions', JSON.stringify([]));
    }
  }

  undoBtn() {
    const length = this.undoActions.length;
    const lastAction = this.undoActions[length - 1];
    const id = lastAction.id;

    let element;
    let position;
    let previousIndex;
    let currentIndex;
    let dragType;
    if (typeof lastAction.action === 'object') {
      previousIndex=lastAction.action.previousIndex
      currentIndex=lastAction.action.currentIndex
      dragType = lastAction.action.dragType;
      element = lastAction.action.element;
    }

    if (typeof previousIndex === 'number' && typeof currentIndex === 'number' && typeof dragType === 'string') {
      dragType === 'move-in' ? this.formInputs.pop() : moveItemInArray(element, previousIndex, currentIndex);
    }

    let value;
    if (typeof lastAction.action === 'string') {
      value = lastAction.action;
    }
    if (element && (value || value === '')) {
      console.log('change value', { text: element.value, element });
      element.value = value;
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
  }

  redoBtn() {
    const length = this.redoActions.length;
    const lastAction = this.redoActions[length - 1];
    const id = lastAction.id;

    let element;
    let position;
    let previousIndex;
    let currentIndex;
    let dragType;
    if (typeof lastAction.action === 'object') {
      previousIndex=lastAction.action.previousIndex
      currentIndex=lastAction.action.currentIndex
      dragType = lastAction.action.dragType;
      element = lastAction.action.element;
    }

    if (typeof previousIndex === 'number' && typeof currentIndex === 'number' && typeof dragType === 'string') {
      dragType === 'move-in' ? this.formInputs.push(element) : moveItemInArray(element, previousIndex, currentIndex);
    }

    let value;
    if (typeof lastAction.action === 'string') {
      value = lastAction.action;
    }
    if (element && (value || value === '')) {
      console.log('change value', { text: element.value, element });
      element.value = value;
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
  }
}
