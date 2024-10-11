import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  private hasInitialStateSaved = false;

  constructor() {}

  /**
   * Method to clone the state to avoid reference issues.
   * @param {T} state - The state to clone.
   * @returns {T} - The cloned state.
   */
  private cloneState(state: T): T {
    return JSON.parse(JSON.stringify(state));
  }

  /**
   * Method to check if the current state is different from the last saved state.
   * @param {T} state - The current state to compare.
   * @returns {boolean} - True if the state is different, false otherwise.
   */
  private isStateDifferent(state: T): boolean {
    return JSON.stringify(this.undoStack[this.undoStack.length - 1]) !== JSON.stringify(state);
  }

  /**
   * Method to save the current state to the undo stack.
   * @param {T} state - The current state to save.
   * @returns {void}
   */
  saveState(state: T): void {
    if (!this.hasInitialStateSaved || this.undoStack.length === 0 || this.isStateDifferent(state)) {
      this.undoStack.push(this.cloneState(state));
      this.redoStack = [];
      this.hasInitialStateSaved = true;
    }
  }

  /**
   * Method to undo the last action and return the previous state.
   * @param {T} currentState - The current state before undoing.
   * @returns {T | null} - The previous state if undo is possible, otherwise null.
   */
  undo(currentState: T): T | null {
    if (this.canUndo()) {
      this.redoStack.push(this.cloneState(currentState));
      return this.undoStack.pop() as T;
    }
    return null;
  }

  /**
   * Method to redo the last undone action and return the next state.
   * @param {T} currentState - The current state before redoing.
   * @returns {T | null} - The next state if redo is possible, otherwise null.
   */
  redo(currentState: T): T | null {
    if (this.canRedo()) {
      this.undoStack.push(this.cloneState(currentState));
      return this.redoStack.pop() as T;
    }
    return null;
  }

  /**
   * Method to clear the undo and redo history.
   * @returns {void}
   */
  clearHistory(): void {
    this.undoStack = [];
    this.redoStack = [];
    this.hasInitialStateSaved = false;
  }

  /**
   * Method to check if undo is possible.
   * @returns {boolean} - True if undo is possible, false otherwise.
   */
  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  /**
   * Method to check if redo is possible.
   * @returns {boolean} - True if redo is possible, false otherwise.
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
