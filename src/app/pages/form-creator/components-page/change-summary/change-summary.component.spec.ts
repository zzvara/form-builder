import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { ChangeSummaryComponent } from './change-summary.component';

describe('ChangeSummaryComponent inline', () => {
  it('rebuilds inline differences on input changes and toggles only the chosen section', () => {
    TestBed.configureTestingModule({
      imports: [ChangeSummaryComponent],
      providers: [
        ...appConfig.providers,
        { provide: NZ_MODAL_DATA, useValue: null },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    });
    const fixture = TestBed.createComponent(ChangeSummaryComponent);
    const component = fixture.componentInstance;
    const question = { id: 'added', data: { title: 'Question', type: 'InputComponent' } };
    fixture.componentRef.setInput('items', [
      { key: 'first', before: '[]', after: JSON.stringify([question]) },
      { key: 'second', before: JSON.stringify([question]), after: '[]' },
    ]);
    fixture.detectChanges();
    expect(component.diffItems()[0].addedItems).toEqual([question]);
    expect(component.diffItems()[1].removedItems).toEqual([question]);
    component.toggle(component.diffItems()[0]);
    expect(component.diffItems().map((item) => item.open)).toEqual([true, false]);
    fixture.componentRef.setInput('items', [{ key: 'first', before: null, after: 2 }]);
    fixture.detectChanges();
    expect(component.diffItems()).toEqual([
      { key: 'editList', open: true, addedItems: [], removedItems: [] },
    ]);
  });
});

describe('ChangeSummaryComponent', () => {
  let component: ChangeSummaryComponent;
  let fixture: ComponentFixture<ChangeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeSummaryComponent],
      providers: [
        ...appConfig.providers,
        { provide: NZ_MODAL_DATA, useValue: { items: [] } },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('identifies added and removed questions by id', () => {
    const before = [{ id: 'removed', data: { title: 'Old', type: 'InputComponent' } }];
    const after = [{ id: 'added', data: { title: 'New', type: 'InputComponent' } }];
    TestBed.inject(NZ_MODAL_DATA).items = [
      { key: 'editList', before: JSON.stringify(before), after: JSON.stringify(after) },
    ];
    component.ngOnInit();
    expect(component.diffItems()).toEqual([
      { key: 'editList', open: false, addedItems: after, removedItems: before },
    ]);
    const previous = component.diffItems()[0];
    component.toggle(previous);
    expect(component.diffItems()[0].open).toBeTrue();
    expect(previous.open).toBeFalse();
  });

  it('shows a safe empty summary for malformed or non-array data', () => {
    TestBed.inject(NZ_MODAL_DATA).items = [
      { key: 'editList', before: 'invalid json', after: '{}' },
    ];
    expect(() => component.ngOnInit()).not.toThrow();
    expect(component.diffItems()).toEqual([
      { key: 'editList', open: true, addedItems: [], removedItems: [] },
    ]);
  });

  it('closes the summary modal', () => {
    component.close();
    expect(TestBed.inject(NzModalRef).close).toHaveBeenCalled();
  });
});
