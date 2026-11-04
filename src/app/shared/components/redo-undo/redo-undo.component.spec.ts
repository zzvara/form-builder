import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RedoUndoComponent } from '@components/redo-undo/redo-undo.component';
import { UndoRedoService } from '@services/undo-redo.service';
import { UndoRedoEnum } from '@interfaces/undo-redo-type.enum';

describe('RedoUndoComponent', () => {
  let component: RedoUndoComponent;
  let fixture: ComponentFixture<RedoUndoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RedoUndoComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(RedoUndoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('reflects history availability and emits undo/redo requests', () => {
    const history = TestBed.inject(UndoRedoService<number>);
    const emitted = spyOn(component.sectionInputsChange, 'emit');
    expect(component.canUndo).toBeFalse();
    history.saveState(1);
    history.saveState(2);
    expect(component.canUndo).toBeTrue();
    component.undoBtn();
    expect(emitted).toHaveBeenCalledWith(UndoRedoEnum.UNDO);
    history.undo();
    expect(component.canRedo).toBeTrue();
    component.redoBtn();
    expect(emitted).toHaveBeenCalledWith(UndoRedoEnum.REDO);
  });
});
