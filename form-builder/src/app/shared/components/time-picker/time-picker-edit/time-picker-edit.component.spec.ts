import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerEditComponent } from '@components/time-picker/time-picker-edit/time-picker-edit.component';

describe('TimePickerEditComponent', () => {
  let component: TimePickerEditComponent;
  let fixture: ComponentFixture<TimePickerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimePickerEditComponent],
    });
    fixture = TestBed.createComponent(TimePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
