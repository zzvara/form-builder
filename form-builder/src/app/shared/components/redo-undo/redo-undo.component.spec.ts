import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedoUndoComponent } from './redo-undo.component';

describe('RedoUndoComponent', () => {
  let component: RedoUndoComponent;
  let fixture: ComponentFixture<RedoUndoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RedoUndoComponent]
    });
    fixture = TestBed.createComponent(RedoUndoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
