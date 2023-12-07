import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MenuOption, MenuState } from 'src/app/shared/models/menu-option.model';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerOptions: BehaviorSubject<MenuState> = new BehaviorSubject<MenuState>({
    options: [MenuOption.HOME, MenuOption.SETTINGS],
    activeOptions: [],
  });

  constructor() {}

  setOptions(options: MenuOption[], activeOptions: MenuOption[] = []): void {
    this.headerOptions.next({ options, activeOptions });
  }

  getOptions(): Observable<MenuState> {
    return this.headerOptions.asObservable();
  }
}
