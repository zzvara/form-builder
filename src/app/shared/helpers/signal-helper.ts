import type { WritableSignal } from '@angular/core';
import { linkedSignal, untracked } from '@angular/core';

/**
 * Creates a writable signal that mirrors `source`, but never treats a value as unchanged.
 *
 * The form model objects (e.g. input data) are mutated in place by several parts of the editor
 * (edit modals, inline editing, reset). Setting the same reference again with `touch()` notifies
 * every consumer, so OnPush views depending on the object are refreshed in zoneless mode.
 */
export function mutableSignal<T>(source: () => T): WritableSignal<T> {
  return linkedSignal<T, T>({
    source,
    computation: (value) => value,
    equal: () => false,
  });
}

/**
 * Notifies the consumers of a signal created with `mutableSignal` that its value was mutated in place.
 */
export function touch<T>(state: WritableSignal<T>): void {
  state.set(untracked(state));
}
