import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ThemeEnum } from '../enums/theme.enum';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  themeChange = new BehaviorSubject(ThemeEnum.LIGHT);
}
