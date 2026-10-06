import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';

describe('DatePickerEditComponent', () => {
  type DatePickerEditFixture = DatePickerEditComponent<
    Date | Date[],
    DatePickerComponentData<Date | Date[]>
  >;

  let component: DatePickerEditFixture;
  let fixture: ComponentFixture<DatePickerEditFixture>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DatePickerEditComponent],
    });
    fixture = TestBed.createComponent(DatePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
