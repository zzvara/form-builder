import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RangePickerComponent } from '@components/range-picker/range-picker.component';

describe('RangePickerComponent', () => {
  let component: RangePickerComponent;
  let fixture: ComponentFixture<RangePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RangePickerComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(RangePickerComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'RangePickerComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
