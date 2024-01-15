import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VersionControlService implements OnDestroy {
  ngOnDestroy(): void {}

  private localStorageKey = '';
  private versionsSubject = new BehaviorSubject<any[]>([]);
  versions$ = this.versionsSubject.asObservable();
  private storageChange$ = new Subject<StorageEvent>();
  private localChange$ = new Subject<void>();

  constructor() {
    this.updateVersions();
    this.setupStorageChangeListener();
  }

  setValue(data: any[]): void {
    const previousVersions = this.getVersions();
    const oldData = this.getData();
    localStorage.setItem(this.getVersionKey(1), JSON.stringify(data));
    this.updateVersions();

    this.triggerLocalChange();
  }

  revertToVersion(index: number): void {
    const versions = this.getVersions();
    if (index >= 0 && index < versions.length) {
      const oldData = this.getData();
      localStorage.setItem(this.getVersionKey(1), localStorage.getItem(this.getVersionKey(index))!);
      this.updateVersions();

      this.triggerLocalChange();
    }
  }

  private updateVersions(): void {
    const data = this.getData();
    const versions = this.getVersions();

    if (!this.isEqual(data, versions[0])) {
      versions.unshift(data);
      localStorage.setItem(this.getVersionKey(1), JSON.stringify(versions));
      this.versionsSubject.next(versions);
    }
  }

  private getData(): any[] {
    const storedData = localStorage.getItem(this.getVersionKey(1));
    return storedData ? JSON.parse(storedData) : [];
  }

  private getVersions(): any[] {
    const versions = [];
    let index = 1;
    while (localStorage.getItem(this.getVersionKey(index))) {
      versions.push(JSON.parse(localStorage.getItem(this.getVersionKey(index))!));
      index++;
    }
    return versions;
  }

  private getVersionKey(index: number): string {
    return `${this.localStorageKey}_${index}`;
  }

  private isEqual(obj1: any, obj2: any): boolean {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  private setupStorageChangeListener(): void {
    window.addEventListener('beforeunload', () => {
      localStorage.setItem(this.getVersionKey(1), JSON.stringify(this.getData()));
    });

    window.addEventListener('storage', (event: StorageEvent) => {
      const oldData = this.getData();
      this.storageChange$.next(event);
      this.logStorageChange(event, oldData);
      this.updateVersions();
    });
  }

  private logStorageChange(event: StorageEvent, oldData: any): void {
    console.log('VersionControl: Storage change detected');
    console.log('Key:', event.key);
    console.log('Old Value:', event.oldValue);
    console.log('New Value:', event.newValue);

    const oldValueChangedKey = `${this.getVersionKey(1)}_oldValue`;
    localStorage.setItem(oldValueChangedKey, event.oldValue!);
  }

  private triggerLocalChange(): void {
    this.localChange$.next();
  }
}
