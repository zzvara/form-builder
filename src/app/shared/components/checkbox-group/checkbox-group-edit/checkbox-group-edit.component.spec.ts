import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CheckboxGroupEditComponent } from '@components/checkbox-group/checkbox-group-edit/checkbox-group-edit.component';

describe('CheckboxGroupEditComponent', () => {
  let component: CheckboxGroupEditComponent;
  let fixture: ComponentFixture<CheckboxGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGroupEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads saved checkbox labels, ids and checked states into a new editor', () => {
    TestBed.inject(NZ_MODAL_DATA).defaultValue = [
      { label: 'Saved', value: 8, checked: true, disabled: false },
    ];
    const loaded = TestBed.createComponent(CheckboxGroupEditComponent);
    loaded.detectChanges();
    expect(loaded.componentInstance.options.value).toEqual([
      { label: 'Saved', value: 8, checked: true, disabled: false },
    ]);
  });

  it('reorders existing options without changing their values', () => {
    for (const label of ['First', 'Second']) {
      component.newOptionValue = label;
      component.addOption();
    }
    component.drop({ previousIndex: 0, currentIndex: 1 } as Parameters<typeof component.drop>[0]);
    expect(component.optionIds).toEqual([2, 1]);
  });

  it('saves checked options and required validation and restores them on reset', () => {
    component.newOptionValue = 'First';
    component.addOption();
    component.options.at(0).patchValue({ checked: true });
    component.getControl('required')!.setValue(true);
    component.getControl('requiredMessage')!.setValue('Choose at least one');
    component.saveData();
    expect(TestBed.inject(NZ_MODAL_DATA)).toEqual(
      jasmine.objectContaining({
        required: true,
        requiredMessage: 'Choose at least one',
        defaultValue: [{ value: 1, label: 'First', checked: true, disabled: false }],
      }),
    );
    component.removeOption(0);
    component.onReset();
    expect(component.options.at(0).value.checked).toBeTrue();
    component.getControl('required')!.setValue(false);
    component.saveData();
    expect(TestBed.inject(NZ_MODAL_DATA).required).toBeFalse();
  });

  it('reports the minimum number of options and rejects a blank edit', () => {
    expect(component.getMinOptions()).toBe(1);
    component.newOptionValue = 'Original';
    component.addOption();
    component.startEdit(0, 'Original');
    component.editControl.setValue(' ');
    component.saveEdit(0);
    expect(component.optionDescriptions).toEqual(['Original']);
  });

  it('adds unchecked options with unique ids and removes the requested option', () => {
    for (const value of ['First', 'Second']) {
      component.newOptionValue = value;
      component.addOption();
    }
    expect(component.options.value).toEqual([
      { label: 'First', value: 1, checked: false, disabled: false },
      { label: 'Second', value: 2, checked: false, disabled: false },
    ]);
    component.removeOption(0);
    component.newOptionValue = 'Third';
    component.addOption();
    expect(component.optionIds).toEqual([2, 3]);
    expect(component.optionDescriptions).toEqual(['Second', 'Third']);
  });

  it('renames a checkbox while preserving its checked state and id', () => {
    component.newOptionValue = 'Original';
    component.addOption();
    component.options.at(0).patchValue({ checked: true });
    component.startEdit(0, 'Original');
    component.editControl.setValue(' Renamed ');
    component.saveEdit(0);
    expect(component.options.at(0).value).toEqual({
      label: 'Renamed',
      value: 1,
      checked: true,
      disabled: false,
    });
    expect(component.editingIndex()).toBeNull();
  });

  it('rejects duplicate labels and resets unsaved options', () => {
    for (const value of ['First', 'Second']) {
      component.newOptionValue = value;
      component.addOption();
    }
    component.startEdit(0, 'First');
    component.editControl.setValue('Second');
    component.saveEdit(0);
    expect(component.editError()).toBeTruthy();
    component.cancelEdit();
    expect(component.optionDescriptions).toEqual(['First', 'Second']);
    component.onReset();
    expect(component.optionDescriptions).toEqual([]);
  });
});
