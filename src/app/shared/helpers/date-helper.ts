import { TimePickerComponentData } from '@components/time-picker/interfaces/time-picker-component-data';
import { DisabledTimeConfig, NzDateMode } from 'ng-zorro-antd/date-picker';

export type DefaultDateComparers = {
  [key in NzDateMode]: (date1: Date, date2: Date) => ComparisonType;
};

export const defaultDateComparers: DefaultDateComparers = {
  decade: compareByYear,
  year: compareByYear,
  month: compareByMonth,
  week: compareByWeek,
  date: compareDatesFull,
  time: compareDateTimeFull,
  quarter: compareByYear,
};

export interface MinMaxDateable {
  minDate: boolean;
  minDateValue?: Date;

  maxDate: boolean;
  maxDateValue?: Date;

  mode: NzDateMode;
}

export function getDisabledDateConfig(data: MinMaxDateable): (current: Date) => boolean {
  return (current: Date): boolean => {
    if (data.minDate && data.minDateValue && defaultDateComparers[data.mode](current, data.minDateValue) < 0) {
      return true;
    }
    return !!(data.maxDate && data.maxDateValue && defaultDateComparers[data.mode](current, data.maxDateValue) > 0);
  };
}

export function getDisabledDatesForMaxDate(maxDate: Date, mode: NzDateMode): (current: Date) => boolean {
  return (current: Date): boolean => maxDate && defaultDateComparers[mode](current, maxDate) > 0;
}

export function getDisabledDatesForMinDate(minDate: Date, mode: NzDateMode): (current: Date) => boolean {
  return (current: Date): boolean => minDate && defaultDateComparers[mode](current, minDate) < 0;
}

export function getDisabledTimeConfig(data: MinMaxDateable, currentDate: Date): DisabledTimeConfig {
  return {
    nzDisabledHours: (): number[] => {
      const hours: number[] = [];
      if (currentDate) {
        if (data.minDate && data.minDateValue) {
          const comparison = compareDatesFull(currentDate, data.minDateValue);
          if (comparison < 0) {
            return range(0, 24);
          } else if (comparison === 0) {
            hours.push(...range(0, data.minDateValue.getHours()));
          }
        }
        if (data.maxDate && data.maxDateValue) {
          const comparison = compareDatesFull(currentDate, data.maxDateValue);
          if (comparison > 0) {
            return range(0, 24);
          } else if (comparison === 0) {
            hours.push(...range(data.maxDateValue.getHours() + 1, 24));
          }
        }
        return hours;
      }
      return range(0, 24);
    },
    nzDisabledMinutes: (hour: number): number[] => {
      const minutes: number[] = [];
      if (currentDate && hour) {
        if (data.minDate && data.minDateValue) {
          const comparison = compareByHoursFull(currentDate, data.minDateValue);
          if (comparison < 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            minutes.push(...range(0, data.minDateValue.getMinutes()));
          }
        }
        if (data.maxDate && data.maxDateValue) {
          const comparison = compareByHoursFull(currentDate, data.maxDateValue);
          if (comparison > 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            minutes.push(...range(data.maxDateValue.getMinutes() + 1, 60));
          }
        }
        return minutes;
      }
      return range(0, 60);
    },
    nzDisabledSeconds: (hour: number, minute: number): number[] => {
      const seconds: number[] = [];
      if (currentDate && hour && minute) {
        if (data.minDate && data.minDateValue) {
          const comparison = compareByMinuteFull(currentDate, data.minDateValue);
          if (comparison < 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            seconds.push(...range(0, data.minDateValue.getSeconds()));
          }
        }
        if (data.maxDate && data.maxDateValue) {
          const comparison = compareByMinuteFull(currentDate, data.maxDateValue);
          if (comparison > 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            seconds.push(...range(data.maxDateValue.getSeconds() + 1, 60));
          }
        }
        return seconds;
      }
      return range(0, 60);
    },
  };
}

export function getDisabledTimeConfigForMaxDate(currentDate: Date, maxDate: Date): DisabledTimeConfig {
  return {
    nzDisabledHours: (): number[] => {
      const hours: number[] = [];
      if (currentDate) {
        if (maxDate) {
          const comparison = compareDatesFull(currentDate, maxDate);
          if (comparison > 0) {
            return range(0, 24);
          } else if (comparison === 0) {
            hours.push(...range(maxDate.getHours() + 1, 24));
          }
        }
        return hours;
      }
      return range(0, 24);
    },
    nzDisabledMinutes: (hour: number): number[] => {
      const minutes: number[] = [];
      if (currentDate && hour) {
        if (maxDate) {
          const comparison = compareByHoursFull(currentDate, maxDate);
          if (comparison > 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            minutes.push(...range(maxDate.getMinutes() + 1, 60));
          }
        }
        return minutes;
      }
      return range(0, 60);
    },
    nzDisabledSeconds: (hour: number, minute: number): number[] => {
      const seconds: number[] = [];
      if (currentDate && hour && minute) {
        if (maxDate) {
          const comparison = compareByMinuteFull(currentDate, maxDate);
          if (comparison > 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            seconds.push(...range(maxDate.getSeconds() + 1, 60));
          }
        }
        return seconds;
      }
      return range(0, 60);
    },
  };
}

export function getDisabledTimeConfigForMinDate(currentDate: Date, minDate: Date): DisabledTimeConfig {
  return {
    nzDisabledHours: (): number[] => {
      const hours: number[] = [];
      if (currentDate) {
        if (minDate) {
          const comparison = compareDatesFull(currentDate, minDate);
          if (comparison < 0) {
            return range(0, 24);
          } else if (comparison === 0) {
            hours.push(...range(0, minDate.getHours()));
          }
        }
        return hours;
      }
      return range(0, 24);
    },
    nzDisabledMinutes: (hour: number): number[] => {
      const minutes: number[] = [];
      if (currentDate && hour) {
        if (minDate) {
          const comparison = compareByHoursFull(currentDate, minDate);
          if (comparison < 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            minutes.push(...range(0, minDate.getMinutes()));
          }
        }
        return minutes;
      }
      return range(0, 60);
    },
    nzDisabledSeconds: (hour: number, minute: number): number[] => {
      const seconds: number[] = [];
      if (currentDate && hour && minute) {
        if (minDate) {
          const comparison = compareByMinuteFull(currentDate, minDate);
          if (comparison < 0) {
            return range(0, 60);
          } else if (comparison === 0) {
            seconds.push(...range(0, minDate.getSeconds()));
          }
        }
        return seconds;
      }
      return range(0, 60);
    },
  };
}

//----------------------------------------------------------------------------------------------------------------------

export function disabledHours(data: TimePickerComponentData): (() => number[]) | undefined {
  return () => {
    const hours: number[] = [];
    if (data.minTime && data.minTimeValue) {
      hours.push(...disabledMinHours(data.minTimeValue)!());
    }
    if (data.maxTime && data.maxTimeValue) {
      hours.push(...disabledMaxHours(data.maxTimeValue)!());
    }
    return hours;
  };
}
export function disabledMinHours(minTime: Date): (() => number[]) | undefined {
  return () => {
    const hours: number[] = [];
    hours.push(...range(0, minTime.getHours()));
    return hours;
  };
}
export function disabledMaxHours(maxTime: Date): (() => number[]) | undefined {
  return () => {
    const hours: number[] = [];
    hours.push(...range(maxTime.getHours() + 1, 24));
    return hours;
  };
}

export function disabledMinutes(data: TimePickerComponentData): ((hour: number) => number[]) | undefined {
  return (hour) => {
    if (hour) {
      const minutes: number[] = [];
      if (data.minTime && data.minTimeValue) {
        minutes.push(...disabledMinMinutes(data.minTimeValue)!(hour));
      }
      if (data.maxTime && data.maxTimeValue) {
        minutes.push(...disabledMaxMinutes(data.maxTimeValue)!(hour));
      }
      return minutes;
    }
    return range(0, 60);
  };
}
export function disabledMinMinutes(minTime: Date): ((hour: number) => number[]) | undefined {
  return (hour) => {
    if (hour) {
      const minutes: number[] = [];
      if (hour === minTime.getHours()) {
        minutes.push(...range(0, minTime.getMinutes()));
      }
      return minutes;
    }
    return range(0, 60);
  };
}
export function disabledMaxMinutes(maxTime: Date): ((hour: number) => number[]) | undefined {
  return (hour) => {
    if (hour) {
      const minutes: number[] = [];
      if (hour === maxTime.getHours()) {
        minutes.push(...range(maxTime.getMinutes() + 1, 60));
      }
      return minutes;
    }
    return range(0, 60);
  };
}

export function disabledSeconds(data: TimePickerComponentData): ((hour: number, minute: number) => number[]) | undefined {
  return (hour, minute) => {
    if (hour && minute) {
      const seconds: number[] = [];
      if (data.minTime && data.minTimeValue) {
        seconds.push(...disabledMinSeconds(data.minTimeValue)!(hour, minute));
      }
      if (data.maxTime && data.maxTimeValue) {
        seconds.push(...disabledMaxSeconds(data.maxTimeValue)!(hour, minute));
      }
      return seconds;
    }
    return range(0, 60);
  };
}
export function disabledMinSeconds(minTime: Date): ((hour: number, minute: number) => number[]) | undefined {
  return (hour, minute) => {
    if (hour && minute) {
      const seconds: number[] = [];
      if (hour === minTime.getHours() && minute === minTime.getMinutes()) {
        seconds.push(...range(0, minTime.getSeconds()));
      }
      return seconds;
    }
    return range(0, 60);
  };
}
export function disabledMaxSeconds(maxTime: Date): ((hour: number, minute: number) => number[]) | undefined {
  return (hour, minute) => {
    if (hour && minute) {
      const seconds: number[] = [];
      if (hour === maxTime.getHours() && minute === maxTime.getMinutes()) {
        seconds.push(...range(maxTime.getSeconds() + 1, 60));
      }
      return seconds;
    }
    return range(0, 60);
  };
}

//----------------------------------------------------------------------------------------------------------------------

//                      lesser, equals, larger
export type ComparisonType = -1 | 0 | 1;

export function compareByNumbers(num1: number, num2: number): ComparisonType {
  if (num1 < num2) {
    return -1;
  } else if (num1 > num2) {
    return 1;
  }
  return 0;
}

function getWeekNumber(date: Date): number {
  // Copying date so the original date won't be modified
  const tempDate = new Date(date.valueOf());

  // ISO week date weeks start on Monday, so correct the day number
  const dayNum = (date.getDay() + 6) % 7;

  // Set the target to the nearest Thursday (current date + 4 - current day number)
  tempDate.setDate(tempDate.getDate() - dayNum + 3);

  // ISO 8601 week number of the year for this date
  const firstThursday = tempDate.valueOf();

  // Set the target to the first day of the year
  // First set the target to January 1st
  tempDate.setMonth(0, 1);

  // If this is not a Thursday, set the target to the next Thursday
  if (tempDate.getDay() !== 4) {
    tempDate.setMonth(0, 1 + ((4 - tempDate.getDay() + 7) % 7));
  }

  // The weeknumber is the number of weeks between the first Thursday of the year
  // and the Thursday in the target week
  return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
}

export function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}

//----------------------------------------------------------------------------------------------------------------------

export function compareByYear(date1: Date, date2: Date): ComparisonType {
  return compareByNumbers(date1.getFullYear(), date2.getFullYear());
}

export function compareByMonth(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByYear(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getMonth(), date2.getMonth());
  }
  return comparison;
}

export function compareByWeek(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByMonth(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(getWeekNumber(date1), getWeekNumber(date2));
  }
  return comparison;
}

export function compareByDay(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByMonth(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getDate(), date2.getDate());
  }
  return comparison;
}

export function compareDatesFull(date1: Date, date2: Date): ComparisonType {
  return compareByDay(date1, date2);
}

//----------------------------------------------------------------------------------------------------------------------

export function compareByHours(date1: Date, date2: Date): ComparisonType {
  return compareByNumbers(date1.getHours(), date2.getHours());
}

export function compareByHoursFull(date1: Date, date2: Date): ComparisonType {
  const comparison = compareDatesFull(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getHours(), date2.getHours());
  }
  return comparison;
}

export function compareByMinute(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByHours(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getMinutes(), date2.getMinutes());
  }
  return comparison;
}

export function compareByMinuteFull(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByHoursFull(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getMinutes(), date2.getMinutes());
  }
  return comparison;
}

export function compareBySecond(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByMinute(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getSeconds(), date2.getSeconds());
  }
  return comparison;
}

export function compareBySecondFull(date1: Date, date2: Date): ComparisonType {
  const comparison = compareByMinuteFull(date1, date2);
  if (comparison === 0) {
    return compareByNumbers(date1.getSeconds(), date2.getSeconds());
  }
  return comparison;
}

export function compareTimeFull(date1: Date, date2: Date): ComparisonType {
  return compareBySecond(date1, date2);
}

//----------------------------------------------------------------------------------------------------------------------

export function compareDateTimeFull(date1: Date, date2: Date): ComparisonType {
  const comparison = compareDatesFull(date1, date2);
  if (comparison === 0) {
    return compareTimeFull(date1, date2);
  }
  return comparison;
}
