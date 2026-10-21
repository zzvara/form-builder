import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RedoUndoComponent } from '@components/redo-undo/redo-undo.component';

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
});
