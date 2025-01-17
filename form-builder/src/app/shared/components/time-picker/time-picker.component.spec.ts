import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerComponent } from '@components/time-picker/time-picker.component';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimePickerComponent],
    });
    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
