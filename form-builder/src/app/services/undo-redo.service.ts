import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService {
  constructor() {}
  undoActions: any = localStorage.getItem('undoActions') === null ? [] : JSON.parse(localStorage.getItem('undoActions') as string);
  redoActions: any = localStorage.getItem('redoActions') === null ? [] : JSON.parse(localStorage.getItem('redoActions') as string);
  canUndo = this.undoActions.length > 0 ? true : false;
  canRedo = this.redoActions.length > 0 ? true : false;

  private saveUndoActionToLocalStorage() {
    localStorage.setItem('undoActions', JSON.stringify(this.undoActions));
  }

  private saveRedoActionToLocalStorage() {
    localStorage.setItem('redoActions', JSON.stringify(this.redoActions));
  }

  addToUndoActions(id: any, action: any) {
    this.undoActions.push({ id, action });
    this.saveUndoActionToLocalStorage();
  }

  addToRedoActions(id: any, action: any) {
    this.redoActions.push({ id, action });
    this.saveRedoActionToLocalStorage();
  }

  undo() {
    const lastAction = this.undoActions.pop();
    this.redoActions.push(lastAction);
    this.saveUndoActionToLocalStorage();
    this.saveRedoActionToLocalStorage();
  }

  redo() {
    const lastAction = this.redoActions.pop();
    this.undoActions.push(lastAction);
    this.saveUndoActionToLocalStorage();
    this.saveRedoActionToLocalStorage();
  }

  dragEvent(event: CdkDragDrop<string[]>) {
    const id = event.item.data?.component;
    let element;
    const previousIndex=event.previousIndex
    const currentIndex =event.currentIndex
    const dragType = event.previousIndex === event.currentIndex && event.currentIndex!==0  ? 'move-inside' : 'move-in';
    for (let i = 0; i < event.container.data?.length; i++) {
      element = event.container.data[i] as any;
    }
    const action = {
      previousIndex,
      currentIndex,
      dragType,
      element
    };
    this.addToUndoActions(id, action);
  }

  changeEvent(event: any) {
    const id = event.target.id;
    const action = event.target.value;
    this.addToUndoActions(id, action);
  }
}
