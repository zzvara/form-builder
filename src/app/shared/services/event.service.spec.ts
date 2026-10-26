import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { ThemeEnum } from '../enums/theme.enum';

describe('EventService', () => {
  it('starts in light mode and synchronizes theme events with its signal', () => {
    const service = TestBed.inject(EventService);
    expect(service.theme()).toBe(ThemeEnum.LIGHT);
    service.themeChange.next(ThemeEnum.DARK);
    expect(service.theme()).toBe(ThemeEnum.DARK);
    service.themeChange.next(ThemeEnum.LIGHT);
    expect(service.theme()).toBe(ThemeEnum.LIGHT);
  });
});
