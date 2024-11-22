import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangePickerEditComponent } from './range-picker-edit.component';

describe('RangePickerEditComponent', () => {
  let component: RangePickerEditComponent;
  let fixture: ComponentFixture<RangePickerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangePickerEditComponent]
    });
    fixture = TestBed.createComponent(RangePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
