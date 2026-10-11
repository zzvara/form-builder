import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService availability', () => {
  it('returns null when no undo or redo operation is available', () => {
    const service = new UndoRedoService<number>();
    expect(service.undo()).toBeNull();
    expect(service.redo()).toBeNull();
    service.saveState(1);
    expect(service.undo()).toBeNull();
  });

  it('isolates saved snapshots and returned states from external mutations', () => {
    const service = new UndoRedoService<{ values: number[] }>();
    const initial = { values: [1] };
    service.saveState(initial);
    initial.values.push(2);
    service.saveState(initial);
    const previous = service.undo()!;
    expect(previous).toEqual({ values: [1] });
    previous.values.push(99);
    expect(service.redo()).toEqual({ values: [1, 2] });
    expect(service.undo()).toEqual({ values: [1] });
  });

  it('clears redo history when a new edit branches from an earlier state', () => {
    const service = new UndoRedoService<number>();
    service.saveState(1);
    service.saveState(2);
    service.undo();
    service.saveState(3);
    expect(service.redo()).toBeNull();
    expect(service.undo()).toBe(1);
  });
  
  it('does not create duplicate consecutive states and permits returning to an earlier value', () => {
    const service = new UndoRedoService<number>();
    service.saveState(1);
    service.saveState(1);
    expect(service.canUndo()).toBeFalse();
    service.saveState(2);
    service.saveState(1);
    expect(service.undo()).toBe(2);
  });

  it('keeps at most ten snapshots and resets availability when cleared', () => {
    const service = new UndoRedoService<number>();
    for (let value = 0; value < 12; value++) service.saveState(value);
    const history: number[] = [];
    while (service.canUndo()) history.push(service.undo()!);
    expect(history).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2]);
    service.clearHistory();
    expect(service.canUndoState()).toBeFalse();
    expect(service.canRedoState()).toBeFalse();
    service.saveState(42);
    expect(service.undo()).toBeNull();
  });
  
  it('publishes undo and redo availability as signals', () => {
    const service = new UndoRedoService<number[]>();
    service.saveState([1]);
    service.saveState([1, 2]);
    expect(service.canUndoState()).toBeTrue();
    expect(service.canRedoState()).toBeFalse();

    service.undo();
    expect(service.canUndoState()).toBeFalse();
    expect(service.canRedoState()).toBeTrue();

    service.redo();
    expect(service.canUndoState()).toBeTrue();
    expect(service.canRedoState()).toBeFalse();
  });
});
