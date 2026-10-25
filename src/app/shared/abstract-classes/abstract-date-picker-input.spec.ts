import { TestBed } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { DatePickerComponent } from '@components/date-picker/date-picker.component';

describe('AbstractDatePickerComponent', () => {
  it('passes date bounds to the time restriction callbacks', () => {
    TestBed.configureTestingModule({
      imports: [DatePickerComponent],
      providers: appConfig.providers,
    });
    const fixture = TestBed.createComponent(DatePickerComponent);
    const data = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'DatePickerComponent',
    )!.data!;
    fixture.componentRef.setInput('data', {
      ...data,
      showTime: true,
      minDate: true,
      minDateValue: new Date(2026, 0, 1, 9),
    });
    expect(
      fixture.componentInstance.disabledTime(new Date(2026, 0, 1))!.nzDisabledHours!(),
    ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });
});
