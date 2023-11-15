import { Injectable, WritableSignal, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuOption } from 'src/app/shared/models/menu-option.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerOptions: BehaviorSubject<MenuOption[]> = new BehaviorSubject<
    MenuOption[]
  >([MenuOption.HOME, MenuOption.SETTINGS]);

  constructor() {}

  setOptions(options: MenuOption[]): void {
    this.headerOptions.next(options);
  }

  getOptions(): Observable<MenuOption[]> {
    return this.headerOptions.asObservable();
  }
}
