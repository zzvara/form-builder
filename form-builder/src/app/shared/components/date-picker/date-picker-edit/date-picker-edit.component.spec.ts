import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '../interfaces/date-picker-component-data';

describe('DatePickerEditComponent', () => {
  let component: DatePickerEditComponent;
  let fixture: ComponentFixture<DatePickerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatePickerEditComponent],
    });
    fixture = TestBed.createComponent<DatePickerEditComponent<Date, DatePickerComponentData<Date>>>(DatePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
