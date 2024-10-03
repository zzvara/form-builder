import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  constructor() {}

  saveState(state: T): void {
    if (this.undoStack.length === 0 || JSON.stringify(this.undoStack[this.undoStack.length - 1]) !== JSON.stringify(state)) {
      this.undoStack.push(JSON.parse(JSON.stringify(state)));
      this.redoStack = [];
    }
  }  

  undo(currentState: T): T | null {
    if (this.canUndo()) {
      this.redoStack.push(JSON.parse(JSON.stringify(currentState)));
      return this.undoStack.pop() as T;
    }
    return null;
  }

  redo(currentState: T): T | null {
    if (this.canRedo()) {
      this.undoStack.push(JSON.parse(JSON.stringify(currentState)));
      return this.redoStack.pop() as T;
    }
    return null;
  }

  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
