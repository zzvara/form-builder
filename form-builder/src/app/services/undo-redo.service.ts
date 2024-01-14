import { CdkDragStart } from '@angular/cdk/drag-drop';
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
    console.log({ serviceActions: this.undoActions });
  }

  addToRedoActions(id: any, action: any) {
    this.redoActions.push({ id, action });
    this.saveRedoActionToLocalStorage();
    console.log({ serviceActions: this.redoActions });
  }

  undo() {
    const lastAction = this.undoActions.pop();
    this.redoActions.push(lastAction);
    this.saveUndoActionToLocalStorage();
    this.saveRedoActionToLocalStorage();
    console.log({ serviceActions: this.undoActions });
  }

  redo() {
    const lastAction = this.redoActions.pop();
    this.undoActions.push(lastAction);
    this.saveUndoActionToLocalStorage();
    this.saveRedoActionToLocalStorage();
    console.log({ serviceActions: this.redoActions });
  }

  dragEvent(event: CdkDragStart) {
    const id = event.source.element.nativeElement.id;
    const action = {
      x: event.source.element.nativeElement.getBoundingClientRect().x,
      y: event.source.element.nativeElement.getBoundingClientRect().y,
    };
    this.addToUndoActions(id, action);
    console.log({ action, id });
  }

  changeEvent(event: any) {
    const id = event.target.id;
    const action = event.target.value;
    this.addToUndoActions(id, action);
    console.log({ action, id });
  }
}
