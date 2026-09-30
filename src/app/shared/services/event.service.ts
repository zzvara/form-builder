import { Injectable, signal } from '@angular/core';
import { ThemeEnum } from '../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  readonly theme = signal(ThemeEnum.LIGHT);
}