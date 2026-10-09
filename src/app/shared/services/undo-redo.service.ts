import { Injectable, signal, computed, WritableSignal, Signal } from '@angular/core';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root',
})
export class UndoRedoService<T> {
  // A belső állapotok mostantól reaktív Signalok
  private readonly undoStack: WritableSignal<T[]> = signal([]);
  private readonly redoStack: WritableSignal<T[]> = signal([]);
  private readonly hasInitialStateSaved: WritableSignal<boolean> = signal(false);
  private readonly MAX_STACK_SIZE = 10;

  // Publikus computed signalok a UI számára
  public readonly canUndo: Signal<boolean> = computed(() => this.undoStack().length > 1);
  public readonly canRedo: Signal<boolean> = computed(() => this.redoStack().length > 0);

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
    const stack = this.undoStack();
    // Compare it with the one before last, because the last state is the current one
    return JSON.stringify(stack[stack.length - 2]) !== JSON.stringify(state);
  }

  /**
   * Method to save the current state to the undo stack.
   * @param {T} state - The current state to save.
   * @returns {void}
   */
  saveState(state: T): void {
    const stack = this.undoStack();
    if (!this.hasInitialStateSaved() || stack.length === 0 || this.isStateDifferent(state)) {

      let newStack = [...stack];
      if (newStack.length >= this.MAX_STACK_SIZE) {
        // Remove the oldest state if the stack size exceeds the limit
        newStack.shift();
      }
      newStack.push(this.cloneState(state));

      // Signalok frissítése új értékekkel
      this.undoStack.set(newStack);
      this.redoStack.set([]);
      this.hasInitialStateSaved.set(true);
    }
  }

  /**
   * Method to undo the last action and return the previous state.
   * @returns {T | null} - The previous state if undo is possible, otherwise null.
   */
  undo(): T | null {
    if (this.canUndo()) {
      const currentUndo = this.undoStack();
      const poppedState = currentUndo[currentUndo.length - 1];

      // Current state is at the top of the undoStack (CLONE STATE IMPORTANT!)
      // Kivesszük a legfelső elemet az undo tömbből
      this.undoStack.set(currentUndo.slice(0, -1));

      // Belerakjuk a klónozott elemet a redo tömbbe
      this.redoStack.update((redo) => [...redo, this.cloneState(poppedState)]);

      // Return the last undoStack or undefined (CLONE STATE IMPORTANT!)
      const newUndo = this.undoStack();
      return this.cloneState(newUndo[newUndo.length - 1]);
    }
    return null;
  }

  /**
   * Method to redo the last undone action and return the next state.
   * @returns {T | null} - The next state if redo is possible, otherwise null.
   */
  redo(): T | null {
    if (this.canRedo()) {
      const currentRedo = this.redoStack();
      const poppedState = currentRedo[currentRedo.length - 1];

      // Kivesszük a legfelső elemet a redo tömbből
      this.redoStack.set(currentRedo.slice(0, -1));

      // Belerakjuk a klónozott elemet az undo tömbbe
      this.undoStack.update((undo) => [...undo, this.cloneState(poppedState)]);

      // Return the last undoStack or undefined (CLONE STATE IMPORTANT!)
      const newUndo = this.undoStack();
      return this.cloneState(newUndo[newUndo.length - 1]);
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
    this.hasInitialStateSaved.set(false);
  }
}
