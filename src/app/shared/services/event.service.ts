import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import { ThemeEnum } from '../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  themeChange = new BehaviorSubject(ThemeEnum.LIGHT);
  readonly theme = toSignal(this.themeChange, { initialValue: ThemeEnum.LIGHT });
}
