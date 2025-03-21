import { Injectable } from '@angular/core';
import { ContextAction } from '@components/header/header.model';
import { MenuOption, MenuState } from '@models/menu-option.model';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private headerOptions: BehaviorSubject<MenuState> = new BehaviorSubject<MenuState>({
    options: [MenuOption.HOME, MenuOption.SETTINGS],
    activeOptions: [],
  });

  private contextActions: BehaviorSubject<ContextAction[]> = new BehaviorSubject<ContextAction[]>([]);
  private saveTriggered: Subject<void> = new Subject<void>();
  private undoTriggered: Subject<void> = new Subject<void>();

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
