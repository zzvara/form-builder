import { Injectable } from '@angular/core';
import type { ContextAction } from '@components/header/header.model';
import type { MenuState } from '@models/menu-option.model';
import { MenuOption } from '@models/menu-option.model';
import type { Observable } from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly headerOptions: BehaviorSubject<MenuState> = new BehaviorSubject<MenuState>({
    options: [MenuOption.HOME, MenuOption.SETTINGS],
    activeOptions: [],
  });

  private readonly contextActions: BehaviorSubject<ContextAction[]> = new BehaviorSubject<
    ContextAction[]
  >([]);
  private readonly saveTriggered: Subject<void> = new Subject<void>();
  private readonly undoTriggered: Subject<void> = new Subject<void>();

  setOptions(options: MenuOption[], activeOptions: MenuOption[] = []): void {
    this.headerOptions.next({ options, activeOptions });
  }

  getOptions(): Observable<MenuState> {
    return this.headerOptions.asObservable();
  }

  setContextActions(actions: ContextAction[]): void {
    this.contextActions.next(actions);
  }

  getContextActions(): Observable<ContextAction[]> {
    return this.contextActions.asObservable();
  }

  triggerSave(): void {
    this.saveTriggered.next();
  }

  onSave(): Observable<void> {
    return this.saveTriggered.asObservable();
  }

  triggerUndo(): void {
    this.undoTriggered.next();
  }

  onUndo(): Observable<void> {
    return this.undoTriggered.asObservable();
  }
}
