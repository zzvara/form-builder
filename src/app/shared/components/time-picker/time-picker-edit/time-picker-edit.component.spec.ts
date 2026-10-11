import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TimePickerEditComponent } from '@components/time-picker/time-picker-edit/time-picker-edit.component';

describe('TimePickerEditComponent', () => {
  let component: TimePickerEditComponent;
  let fixture: ComponentFixture<TimePickerEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TimePickerEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: NZ_MODAL_DATA,
          useValue: { timeFormat: 'HH:mm:ss', hourStep: 1, minuteStep: 1, secondStep: 1 },
        },
      ],
    });
    fixture = TestBed.createComponent(TimePickerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const enabled of [true, false]) {
    it(`saves time display settings with ${enabled ? 'enabled' : 'disabled'} bounds`, () => {
      const min = new Date(2026, 0, 1, 9);
      const max = new Date(2026, 0, 1, 17);
      for (const [name, value] of Object.entries({
        questionValue: 'Time',
        timeFormat: 'HH:mm',
        use12Hours: true,
        hideDisabledOptions: true,
        hourStep: 2,
        minuteStep: 5,
        secondStep: 10,
        minTime: enabled,
        maxTime: enabled,
        minTimeValue: min,
        maxTimeValue: max,
      }))
        component.getControl(name)!.setValue(value);
      component.saveData();
      const saved = TestBed.inject(NZ_MODAL_DATA);
      expect(saved).toEqual(
        jasmine.objectContaining({
          timeFormat: 'HH:mm',
          use12Hours: true,
          hideDisabledOptions: true,
          hourStep: 2,
          minuteStep: 5,
          secondStep: 10,
          minTime: enabled,
          maxTime: enabled,
        }),
      );
      if (enabled) {
        expect(saved.minTimeValue).toEqual(min);
        expect(saved.maxTimeValue).toEqual(max);
      }
    });
  }

  it('does not restrict minutes or seconds when their bound is absent', () => {
    expect(component.getDisabledMinMinutes()).toBeUndefined();
    expect(component.getDisabledMinSeconds()).toBeUndefined();
    expect(component.getDisabledMaxMinutes()).toBeUndefined();
    expect(component.getDisabledMaxSeconds()).toBeUndefined();
  });

  it('restricts hours, minutes and seconds only when time bounds are enabled', () => {
    expect(component.getDisabledMinHours()).toBeUndefined();
    expect(component.getDisabledMaxHours()).toBeUndefined();
    component.getStrictControl('minTime')!.setValue(true);
    component.getStrictControl('minTimeValue')!.setValue(new Date(2026, 0, 1, 1, 2, 3));
    expect(component.getDisabledMinHours()!()).toEqual([0]);
    expect(component.getDisabledMinMinutes()!(1)).toEqual([0, 1]);
    expect(component.getDisabledMinSeconds()!(1, 2)).toEqual([0, 1, 2]);
    component.getStrictControl('maxTime')!.setValue(true);
    component.getStrictControl('maxTimeValue')!.setValue(new Date(2026, 0, 1, 22, 58, 58));
    expect(component.getDisabledMaxHours()!()).toEqual([23]);
    expect(component.getDisabledMaxMinutes()!(22)).toEqual([59]);
    expect(component.getDisabledMaxSeconds()!(22, 58)).toEqual([59]);
  });
});
