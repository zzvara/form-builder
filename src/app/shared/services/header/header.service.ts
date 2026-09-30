import { Injectable, signal } from '@angular/core';
import type { ContextAction } from '@components/header/header.model';
import type { MenuState } from '@models/menu-option.model';
import { MenuOption } from '@models/menu-option.model';
import type { Observable} from 'rxjs';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly initialOptions: MenuState = {
    options: [MenuOption.HOME, MenuOption.SETTINGS],
    activeOptions: [],
  };
  private readonly optionsState = signal<MenuState>(this.initialOptions);
  readonly options = this.optionsState.asReadonly();
  private readonly actionsState = signal<ContextAction[]>([]);
  readonly actions = this.actionsState.asReadonly();
  private readonly options$ = new BehaviorSubject<MenuState>(this.initialOptions);
  private readonly actions$ = new BehaviorSubject<ContextAction[]>([]);
  private readonly saveTriggered: Subject<void> = new Subject<void>();
  private readonly undoTriggered: Subject<void> = new Subject<void>();

  setOptions(options: MenuOption[], activeOptions: MenuOption[] = []): void {
    const state = { options, activeOptions };
    this.optionsState.set(state);
    this.options$.next(state);
  }

  getOptions(): Observable<MenuState> {
    return this.options$.asObservable();
  }

  setContextActions(actions: ContextAction[]): void {
    this.actionsState.set(actions);
    this.actions$.next(actions);
  }

  getContextActions(): Observable<ContextAction[]> {
    return this.actions$.asObservable();
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
