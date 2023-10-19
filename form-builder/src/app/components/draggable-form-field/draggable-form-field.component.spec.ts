import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableFormFieldComponent } from './draggable-form-field.component';

describe('DraggableFormFieldComponent', () => {
  let component: DraggableFormFieldComponent;
  let fixture: ComponentFixture<DraggableFormFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DraggableFormFieldComponent]
    });
    fixture = TestBed.createComponent(DraggableFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
