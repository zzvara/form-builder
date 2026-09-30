import { UndoRedoService } from './undo-redo.service';

describe('UndoRedoService availability', () => {
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
