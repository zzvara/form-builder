import type { Signal } from '@angular/core';
import { Injectable, computed, signal } from '@angular/core';
import { ContextAction } from '@components/header/header.model';
import { MenuOption, MenuState } from '@models/menu-option.model';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  private readonly headerOptions = signal<MenuState>({
    options: [MenuOption.HOME, MenuOption.SETTINGS],
    activeOptions: [],
  });
  private readonly contextActions = signal<ContextAction[]>([]);

  readonly options: Signal<MenuState> = this.headerOptions.asReadonly();
  readonly actions: Signal<ContextAction[]> = this.contextActions.asReadonly();
  readonly activeOptions: Signal<MenuOption[]> = computed(
    () => this.headerOptions().activeOptions,
  );

  private readonly saveTriggered: Subject<void> = new Subject<void>();
  private readonly undoTriggered: Subject<void> = new Subject<void>();

  setOptions(options: MenuOption[], activeOptions: MenuOption[] = []): void {
    this.headerOptions.set({ options, activeOptions });
  }

  setContextActions(actions: ContextAction[]): void {
    this.contextActions.set(actions);
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