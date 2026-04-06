import { Injectable, signal, Signal } from '@angular/core';
import { ContextAction } from '@components/header/header.model';
import { MenuOption } from '@models/menu-option.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly _headerOptions = signal<MenuOption[]>([MenuOption.HOME, MenuOption.SETTINGS]);
  private readonly _activeOptions = signal<MenuOption[]>([]);

  private readonly _contextActions = signal<ContextAction[]>([]);

  public readonly headerOptions: Signal<MenuOption[]> = this._headerOptions.asReadonly();
  public readonly activeOptions: Signal<MenuOption[]> = this._activeOptions.asReadonly();

  public readonly contextActions: Signal<ContextAction[]> = this._contextActions.asReadonly();

  private readonly saveTriggered: Subject<void> = new Subject<void>();
  private readonly undoTriggered: Subject<void> = new Subject<void>();

  setOptions(options: MenuOption[], activeOptions: MenuOption[] = []): void {
    this._headerOptions.set(options);
    this._activeOptions.set(activeOptions);
  }

  setContextActions(actions: ContextAction[]): void {
    this._contextActions.set(actions);
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
