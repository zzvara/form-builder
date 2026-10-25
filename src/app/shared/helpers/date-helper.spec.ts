import * as dates from './date-helper';
import type { TimePickerComponentData } from '@components/time-picker/interfaces/time-picker-component-data';

describe('date helpers', () => {
  const morning = new Date(2026, 3, 6, 9, 15, 20);
  const evening = new Date(2026, 3, 6, 18, 45, 50);
  const bounds: dates.MinMaxDateable = {
    minDate: true,
    minDateValue: morning,
    maxDate: true,
    maxDateValue: evening,
    mode: 'date',
  };
  const timeBounds: TimePickerComponentData = {
    required: false,
    showTooltip: false,
    minTime: true,
    maxTime: true,
    minTimeValue: morning,
    maxTimeValue: evening,
    timeFormat: 'HH:mm:ss',
    use12Hours: false,
    hideDisabledOptions: false,
    hourStep: 1,
    minuteStep: 1,
    secondStep: 1,
  };

  it('creates half-open ranges and handles empty ranges', () => {
    expect(dates.range(2, 5)).toEqual([2, 3, 4]);
    expect(dates.range(3, 3)).toEqual([]);
    expect(dates.range(5, 2)).toEqual([]);
  });

  it('compares numbers with a three-way result', () => {
    expect(dates.compareByNumbers(-2, 0)).toBe(-1);
    expect(dates.compareByNumbers(2, 2)).toBe(0);
    expect(dates.compareByNumbers(3, 2)).toBe(1);
  });

  for (const compare of [
    dates.compareByYear,
    dates.compareByMonth,
    dates.compareByDay,
    dates.compareDatesFull,
    dates.compareByHoursFull,
    dates.compareByMinuteFull,
    dates.compareBySecondFull,
    dates.compareDateTimeFull,
  ]) {
    it(`${compare.name} orders calendar dates without mutating them`, () => {
      const earlier = new Date(2025, 11, 31, 23, 59, 59);
      const later = new Date(2026, 0, 1);
      const timestamp = earlier.getTime();
      expect(compare(earlier, later)).toBe(-1);
      expect(compare(later, earlier)).toBe(1);
      expect(compare(earlier, new Date(timestamp))).toBe(0);
      expect(earlier.getTime()).toBe(timestamp);
    });
  }

  it('compares time-only values independently of the date', () => {
    for (const compare of [
      dates.compareByHours,
      dates.compareByMinute,
      dates.compareBySecond,
      dates.compareTimeFull,
    ]) {
      expect(compare(new Date(2027, 0, 1, 9), new Date(2026, 0, 1, 10))).toBe(-1);
    }
    expect(dates.compareByHours(morning, new Date(2026, 3, 6, 9, 59))).toBe(0);
    expect(dates.compareByMinute(morning, new Date(2026, 3, 6, 9, 16))).toBe(-1);
    expect(dates.compareTimeFull(morning, new Date(2026, 3, 6, 9, 15, 21))).toBe(-1);
  });

  it('treats days of the same ISO week as equal across month and year boundaries', () => {
    expect(dates.compareByWeek(new Date(2026, 0, 31), new Date(2026, 1, 1))).toBe(0);
    expect(dates.compareByWeek(new Date(2025, 11, 29), new Date(2026, 0, 4))).toBe(0);
    expect(dates.compareByWeek(new Date(2026, 0, 4), new Date(2026, 0, 5))).toBe(-1);
  });

  it('allows inclusive date boundaries and respects disabled bounds', () => {
    const disabled = dates.getDisabledDateConfig(bounds);
    expect(disabled(new Date(2026, 3, 5))).toBeTrue();
    expect(disabled(morning)).toBeFalse();
    expect(disabled(evening)).toBeFalse();
    expect(disabled(new Date(2026, 3, 7))).toBeTrue();
    expect(
      dates.getDisabledDateConfig({ ...bounds, minDate: false, maxDate: false })(new Date(2020, 0)),
    ).toBeFalse();
    expect(dates.getDisabledDatesForMinDate(morning, 'date')(morning)).toBeFalse();
    expect(dates.getDisabledDatesForMaxDate(evening, 'date')(evening)).toBeFalse();
    expect(dates.getDisabledDatesForMaxDate(evening, 'date')(new Date(2026, 3, 7))).toBeTrue();
  });

  it('disables hours outside the selected date bounds', () => {
    expect(dates.getDisabledTimeConfig(bounds, morning).nzDisabledHours!()).toEqual([
      ...dates.range(0, 9),
      ...dates.range(19, 24),
    ]);
    expect(dates.getDisabledTimeConfig(bounds, new Date(2026, 3, 5)).nzDisabledHours!()).toHaveSize(
      24,
    );
    expect(dates.getDisabledTimeConfigForMinDate(morning, morning).nzDisabledHours!()).toEqual(
      dates.range(0, 9),
    );
    expect(dates.getDisabledTimeConfigForMaxDate(evening, evening).nzDisabledHours!()).toEqual(
      dates.range(19, 24),
    );
  });

  it('uses the selected hour and minute instead of stale values in the current date', () => {
    const config = dates.getDisabledTimeConfig(bounds, morning);
    expect(config.nzDisabledMinutes!(9)).toEqual(dates.range(0, 15));
    expect(config.nzDisabledMinutes!(10)).toEqual([]);
    expect(config.nzDisabledMinutes!(18)).toEqual(dates.range(46, 60));
    expect(config.nzDisabledSeconds!(9, 15)).toEqual(dates.range(0, 20));
    expect(config.nzDisabledSeconds!(9, 16)).toEqual([]);
    expect(config.nzDisabledSeconds!(18, 45)).toEqual(dates.range(51, 60));
  });

  it('supports midnight and minute zero in time pickers', () => {
    const midnight = new Date(2026, 0, 1, 0, 0, 10);
    expect(dates.disabledMinMinutes(midnight)!(0)).toEqual([]);
    expect(dates.disabledMinSeconds(midnight)!(0, 0)).toEqual(dates.range(0, 10));
    expect(dates.disabledMaxMinutes(midnight)!(0)).toEqual(dates.range(1, 60));
    expect(dates.disabledMaxSeconds(midnight)!(0, 0)).toEqual(dates.range(11, 60));
  });

  it('combines minimum and maximum time restrictions', () => {
    expect(dates.disabledHours(timeBounds)!()).toEqual([
      ...dates.range(0, 9),
      ...dates.range(19, 24),
    ]);
    expect(dates.disabledMinutes(timeBounds)!(9)).toEqual(dates.range(0, 15));
    expect(dates.disabledMinutes(timeBounds)!(18)).toEqual(dates.range(46, 60));
    expect(dates.disabledSeconds(timeBounds)!(9, 15)).toEqual(dates.range(0, 20));
    expect(dates.disabledSeconds(timeBounds)!(18, 45)).toEqual(dates.range(51, 60));
    expect(dates.disabledMinutes(timeBounds)!(12)).toEqual([]);
  });

  for (const [name, config] of [
    ['combined', (current: Date) => dates.getDisabledTimeConfig(bounds, current)],
    ['minimum', (current: Date) => dates.getDisabledTimeConfigForMinDate(current, morning)],
    ['maximum', (current: Date) => dates.getDisabledTimeConfigForMaxDate(current, evening)],
  ] as const) {
    it(`${name} time restrictions disable all choices for a cleared date or an unselected hour/minute`, () => {
      // Date pickers can emit null when the user clears their value.
      const cleared = config(null as unknown as Date);
      expect(cleared.nzDisabledHours!()).toHaveSize(24);
      expect(cleared.nzDisabledMinutes!(0)).toHaveSize(60);
      expect(cleared.nzDisabledSeconds!(0, 0)).toHaveSize(60);
      const selected = config(morning);
      expect(selected.nzDisabledMinutes!(-1)).toHaveSize(60);
      expect(selected.nzDisabledSeconds!(-1, 0)).toHaveSize(60);
      expect(selected.nzDisabledSeconds!(0, -1)).toHaveSize(60);
    });
  }

  it('disables complete dates, hours and minutes outside the allowed interval', () => {
    const after = new Date(2026, 3, 7);
    const before = new Date(2026, 3, 5);
    for (const config of [
      dates.getDisabledTimeConfig(bounds, after),
      dates.getDisabledTimeConfigForMaxDate(after, evening),
      dates.getDisabledTimeConfigForMinDate(before, morning),
    ]) {
      expect(config.nzDisabledHours!()).toHaveSize(24);
      expect(config.nzDisabledMinutes!(12)).toHaveSize(60);
      expect(config.nzDisabledSeconds!(12, 30)).toHaveSize(60);
    }
    const config = dates.getDisabledTimeConfig(bounds, morning);
    expect(config.nzDisabledMinutes!(8)).toHaveSize(60);
    expect(config.nzDisabledMinutes!(19)).toHaveSize(60);
    expect(config.nzDisabledSeconds!(9, 14)).toHaveSize(60);
    expect(config.nzDisabledSeconds!(18, 46)).toHaveSize(60);
  });

  it('applies standalone lower and upper time bounds inclusively', () => {
    const min = dates.getDisabledTimeConfigForMinDate(morning, morning);
    const max = dates.getDisabledTimeConfigForMaxDate(morning, evening);
    expect(min.nzDisabledMinutes!(9)).toEqual(dates.range(0, 15));
    expect(min.nzDisabledMinutes!(10)).toEqual([]);
    expect(min.nzDisabledSeconds!(9, 15)).toEqual(dates.range(0, 20));
    expect(min.nzDisabledSeconds!(9, 16)).toEqual([]);
    expect(max.nzDisabledMinutes!(18)).toEqual(dates.range(46, 60));
    expect(max.nzDisabledMinutes!(17)).toEqual([]);
    expect(max.nzDisabledSeconds!(18, 45)).toEqual(dates.range(51, 60));
    expect(max.nzDisabledSeconds!(18, 44)).toEqual([]);
  });

  it('allows all times when date restrictions are absent or disabled', () => {
    for (const config of [
      dates.getDisabledTimeConfig({ ...bounds, minDate: false, maxDate: false }, morning),
      dates.getDisabledTimeConfig(
        { ...bounds, minDateValue: undefined, maxDateValue: undefined },
        morning,
      ),
      dates.getDisabledTimeConfigForMinDate(morning, null as unknown as Date),
      dates.getDisabledTimeConfigForMaxDate(morning, null as unknown as Date),
    ]) {
      expect(config.nzDisabledHours!()).toEqual([]);
      expect(config.nzDisabledMinutes!(0)).toEqual([]);
      expect(config.nzDisabledSeconds!(0, 0)).toEqual([]);
    }
  });

  it('allows every time on dates wholly inside the permitted range', () => {
    const min = dates.getDisabledTimeConfigForMinDate(new Date(2026, 3, 7), morning);
    const max = dates.getDisabledTimeConfigForMaxDate(new Date(2026, 3, 5), evening);
    expect(min.nzDisabledHours!()).toEqual([]);
    expect(max.nzDisabledHours!()).toEqual([]);
  });

  it('blocks unselected time parts and ignores disabled standalone time bounds', () => {
    for (const minutes of [
      dates.disabledMinutes(timeBounds)!,
      dates.disabledMinMinutes(morning)!,
      dates.disabledMaxMinutes(evening)!,
    ]) {
      expect(minutes(-1)).toHaveSize(60);
      expect(minutes(12)).toEqual([]);
    }
    for (const seconds of [
      dates.disabledSeconds(timeBounds)!,
      dates.disabledMinSeconds(morning)!,
      dates.disabledMaxSeconds(evening)!,
    ]) {
      expect(seconds(-1, 30)).toHaveSize(60);
      expect(seconds(12, -1)).toHaveSize(60);
      expect(seconds(12, 30)).toEqual([]);
    }
    for (const data of [
      { ...timeBounds, minTime: false, maxTime: false },
      { ...timeBounds, minTimeValue: undefined, maxTimeValue: undefined },
    ]) {
      expect(dates.disabledHours(data)!()).toEqual([]);
      expect(dates.disabledMinutes(data)!(0)).toEqual([]);
      expect(dates.disabledSeconds(data)!(0, 0)).toEqual([]);
    }
  });
});
