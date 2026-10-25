import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];
  private hasInitialStateSaved = false;
  private readonly MAX_STACK_SIZE = 10;

  /**
   * Method to clone the state to avoid reference issues.
   * @param {T} state - The state to clone.
   * @returns {T} - The cloned state.
   */
  private cloneState(state: T): T {
    return cloneDeep(state);
  }

  /**
   * Method to check if the current state is different from the last saved state.
   * @param {T} state - The current state to compare.
   * @returns {boolean} - True if the state is different, false otherwise.
   */
  private isStateDifferent(state: T): boolean {
    // Compare it with the one before last, because the last state is the current one
    return JSON.stringify(this.undoStack[this.undoStack.length - 2]) !== JSON.stringify(state);
  }

  /**
   * Method to save the current state to the undo stack.
   * @param {T} state - The current state to save.
   * @returns {void}
   */
  saveState(state: T): void {
    if (!this.hasInitialStateSaved || this.undoStack.length === 0 || this.isStateDifferent(state)) {
      if (this.undoStack.length >= this.MAX_STACK_SIZE) {
        // Remove the oldest state if the stack size exceeds the limit
        this.undoStack.shift();
      }
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
  undo(): T | null {
    if (this.canUndo()) {
      // Current state is at the top of the undoStack (CLONE STATE IMPORTANT!)
      this.redoStack.push(this.cloneState(this.undoStack.pop()!));
      // Return the last undoStack or undefined (CLONE STATE IMPORTANT!)
      return this.cloneState(this.undoStack[this.undoStack.length - 1]);
    }
    return null;
  }

  /**
   * Method to redo the last undone action and return the next state.
   * @returns {T | null} - The next state if redo is possible, otherwise null.
   */
  redo(): T | null {
    if (this.canRedo()) {
      // Current state is at the top of the redoStack (CLONE STATE IMPORTANT!)
      this.undoStack.push(this.cloneState(this.redoStack.pop()!));
      // Return the last undoStack or undefined (CLONE STATE IMPORTANT!)
      return this.cloneState(this.undoStack[this.undoStack.length - 1]);
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
    return this.undoStack.length > 1;
  }

  /**
   * Method to check if redo is possible.
   * @returns {boolean} - True if redo is possible, false otherwise.
   */
  canRedo(): boolean {
    return this.redoStack.length > 0;
  }
}
