import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { DatePickerEditComponent } from '@components/date-picker/date-picker-edit/date-picker-edit.component';
import type { DatePickerComponentData } from '@components/date-picker/interfaces/date-picker-component-data';

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
      providers: [
        ...appConfig.providers,
        { provide: NZ_MODAL_DATA, useValue: { mode: 'date', dateFormat: 'yyyy-MM-dd' } },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    });
    fixture = TestBed.createComponent(DatePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const enabled of [true, false]) {
    it(`saves ${enabled ? 'enabled' : 'disabled'} date and time restrictions`, () => {
      const min = new Date(2026, 0, 1, 9);
      const max = new Date(2026, 0, 31, 17);
      const settings = {
        questionValue: 'When?',
        mode: 'date',
        dateFormat: 'yyyy-MM-dd',
        timeFormat: ' HH:mm',
        showTime: enabled,
        minDate: enabled,
        maxDate: enabled,
        minDateValue: min,
        maxDateValue: max,
        showWeekNumber: true,
        inlineMode: true,
      };
      for (const [name, value] of Object.entries(settings))
        component.getControl(name)!.setValue(value);
      component.saveData();
      const saved = TestBed.inject(NZ_MODAL_DATA);
      expect(saved).toEqual(
        jasmine.objectContaining({
          questionValue: 'When?',
          showTime: enabled,
          minDate: enabled,
          maxDate: enabled,
          showWeekNumber: true,
          inlineMode: true,
        }),
      );
      if (enabled) {
        expect(saved.minDateValue).toEqual(min);
        expect(saved.maxDateValue).toEqual(max);
        expect(saved.timeFormat).toBe(' HH:mm');
      }
    });
  }

  it('exposes date and time restrictions for the minimum and maximum pickers', () => {
    const date = new Date(2026, 0, 1, 12);
    expect(component.disabledTime(date)).toBeUndefined();
    expect(component.getTimeOptions).toBeNull();
    expect(component.getFullFormat).toBe('yyyy-MM-dd');
    expect(component.getDisabledDatesForMin).toBeUndefined();
    expect(component.getDisabledDatesForMax).toBeUndefined();
    expect(component.disabledTimeConfigForMin(date)).toBeUndefined();
    expect(component.disabledTimeConfigForMax(date)).toBeUndefined();
    for (const [name, value] of Object.entries({
      timeFormat: ' HH:mm',
      showTime: true,
      minDate: true,
      maxDate: true,
      minDateValue: new Date(2026, 0, 1, 9),
      maxDateValue: new Date(2026, 0, 1, 17),
    }))
      component.getControl(name)!.setValue(value);
    expect(component.getTimeOptions).toEqual({ nzFormat: ' HH:mm', nzHideDisabledOptions: false });
    expect(component.getFullFormat).toBe('yyyy-MM-dd HH:mm');
    expect(component.getDisabledDatesForMin!(new Date(2026, 0, 2))).toBeTrue();
    expect(component.getDisabledDatesForMax!(new Date(2025, 11, 31))).toBeTrue();
    expect(component.disabledTime(date)!.nzDisabledHours!()).toContain(8);
    expect(component.disabledTimeConfigForMin(date)!.nzDisabledHours!()).toContain(18);
    expect(component.disabledTimeConfigForMax(date)!.nzDisabledHours!()).toContain(8);
    component.getControl('mode')!.setValue('date');
    expect(component.getControlValue('showTime')).toBeTrue();
  });

  it('clears incompatible bounds and time selection when switching to month mode', () => {
    component.getStrictControl('showTime')!.setValue(true);
    component.getStrictControl('minDateValue')!.setValue(new Date(2026, 0, 1));
    component.getStrictControl('maxDateValue')!.setValue(new Date(2026, 0, 31));
    component.getStrictControl('mode')!.setValue('month');
    expect(component.getStrictControlValue('minDateValue')).toBeNull();
    expect(component.getStrictControlValue('maxDateValue')).toBeNull();
    expect(component.getStrictControlValue('showTime')).toBeFalse();
    expect(component.getStrictControlValue('dateFormat')).toBe('yyyy.MM');
  });

  it('requires a minimum date only while its restriction is enabled', () => {
    component.getStrictControl('minDate')!.setValue(true);
    expect(component.getStrictControl('minDateValue')!.hasError('required')).toBeTrue();
    component.getStrictControl('minDate')!.setValue(false);
    expect(component.getStrictControl('minDateValue')!.hasError('required')).toBeFalse();
  });
});
