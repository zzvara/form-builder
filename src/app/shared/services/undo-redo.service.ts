import { Injectable, computed, signal } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  private readonly undoStack = signal<T[]>([]);
  private readonly redoStack = signal<T[]>([]);
  private hasInitialStateSaved = false;
  private readonly MAX_STACK_SIZE = 10;

  /**
   * True if undo is possible.
   */
  readonly canUndoState = computed(() => this.undoStack().length > 1);

  /**
   * True if redo is possible.
   */
  readonly canRedoState = computed(() => this.redoStack().length > 0);

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
    const undoStack = this.undoStack();
    // Compare it with the one before last, because the last state is the current one
    return JSON.stringify(undoStack[undoStack.length - 2]) !== JSON.stringify(state);
  }

  /**
   * Method to save the current state to the undo stack.
   * @param {T} state - The current state to save.
   * @returns {void}
   */
  saveState(state: T): void {
    if (
      !this.hasInitialStateSaved ||
      this.undoStack().length === 0 ||
      this.isStateDifferent(state)
    ) {
      this.undoStack.update((stack) => {
        // Remove the oldest state if the stack size exceeds the limit
        const limited = stack.length >= this.MAX_STACK_SIZE ? stack.slice(1) : stack;
        return [...limited, this.cloneState(state)];
      });
      this.redoStack.set([]);
      this.hasInitialStateSaved = true;
    }
  }

  /**
   * Method to undo the last action and return the previous state.
   * @returns {T | null} - The previous state if undo is possible, otherwise null.
   */
  undo(): T | null {
    if (this.canUndo()) {
      const undoStack = this.undoStack();
      // Current state is at the top of the undoStack (CLONE STATE IMPORTANT!)
      const current = undoStack[undoStack.length - 1];
      const remaining = undoStack.slice(0, -1);
      this.undoStack.set(remaining);
      this.redoStack.update((stack) => [...stack, this.cloneState(current)]);
      // Return the last undoStack or undefined (CLONE STATE IMPORTANT!)
      return this.cloneState(remaining[remaining.length - 1]);
    }
    return null;
  }

  /**
   * Method to redo the last undone action and return the next state.
   * @returns {T | null} - The next state if redo is possible, otherwise null.
   */
  redo(): T | null {
    if (this.canRedo()) {
      const redoStack = this.redoStack();
      // Current state is at the top of the redoStack (CLONE STATE IMPORTANT!)
      const next = redoStack[redoStack.length - 1];
      this.redoStack.set(redoStack.slice(0, -1));
      this.undoStack.update((stack) => [...stack, this.cloneState(next)]);
      // Return the last undoStack or undefined (CLONE STATE IMPORTANT!)
      return this.cloneState(next);
    }
    return null;
  }

  /**
   * Method to clear the undo and redo history.
   * @returns {void}
   */
  clearHistory(): void {
    this.undoStack.set([]);
    this.redoStack.set([]);
    this.hasInitialStateSaved = false;
  }

  /**
   * Method to check if undo is possible.
   * @returns {boolean} - True if undo is possible, false otherwise.
   */
  canUndo(): boolean {
    return this.canUndoState();
  }

  /**
   * Method to check if redo is possible.
   * @returns {boolean} - True if redo is possible, false otherwise.
   */
  canRedo(): boolean {
    return this.canRedoState();
  }
}