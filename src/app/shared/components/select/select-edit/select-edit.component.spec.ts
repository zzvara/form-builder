import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { SelectEditComponent } from '@components/select/select-edit/select-edit.component';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';

describe('SelectEditComponent', () => {
  let component: SelectEditComponent;
  let fixture: ComponentFixture<SelectEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectEditComponent],
      providers: [
        ...appConfig.providers,
        {
          provide: NZ_MODAL_DATA,
          useValue: { selectOptions: [], isMultipleChoice: false },
        },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  it('loads saved choices into a new editor', () => {
    TestBed.inject(NZ_MODAL_DATA).selectOptions = ['Saved', 'Other'];
    const loaded = TestBed.createComponent(SelectEditComponent);
    loaded.detectChanges();
    expect(loaded.componentInstance.optionsValues).toEqual(['Saved', 'Other']);
  });

  it('reorders existing options without changing their values', () => {
    for (const label of ['First', 'Second']) {
      component.newOptionValue = label;
      component.addOption();
    }
    component.drop({ previousIndex: 0, currentIndex: 1 } as Parameters<typeof component.drop>[0]);
    expect(component.optionsValues).toEqual(['Second', 'First']);
  });

  function addOptions() {
    for (const value of ['First', 'Second']) {
      component.newOptionValue = value;
      component.addOption();
    }
  }

  for (const multiple of [true, false]) {
    it(`saves ${multiple ? 'multiple' : 'single'} choice defaults and clears them when disabled`, () => {
      addOptions();
      component.getControl('isMultipleChoice')!.setValue(multiple);
      component.getControl('questionValue')!.setValue('Choose');
      component.setDefaultValue(multiple ? ['First'] : 'First');
      component.saveData();
      expect(TestBed.inject(NZ_MODAL_DATA)).toEqual(
        jasmine.objectContaining({
          questionValue: 'Choose',
          isMultipleChoice: multiple,
          selectOptions: ['First', 'Second'],
          defaultValue: multiple ? ['First'] : 'First',
        }),
      );
      component.getControl('setDefaultValue')!.setValue(false);
      component.saveData();
      expect(TestBed.inject(NZ_MODAL_DATA).defaultValue).toEqual(multiple ? [] : '');
      component.removeOption(component.options.at(0), 0);
      component.onReset();
      expect(component.optionsValues).toEqual(['First', 'Second']);
    });
  }

  it('reports missing options, ignores blank renames, and clears deleted single defaults', () => {
    expect(component.getMinOptions()).toBe(2);
    addOptions();
    component.startEdit(0, 'First');
    component.editControl.setValue(' ');
    component.saveEdit(0);
    expect(component.optionsValues[0]).toBe('First');
    component.setDefaultValue('First');
    component.removeOption(component.options.at(0), 0);
    expect(component.getDefaultValues()).toBe('');
  });

  it('adds options and rejects duplicate option names', () => {
    addOptions();
    expect(component.optionsValues).toEqual(['First', 'Second']);
    expect(component.options.dirty).toBeTrue();
    component.newOptionValue = 'First';
    expect(component.newOption.invalid).toBeTrue();
    component.startEdit(0, 'First');
    component.editControl.setValue('Second');
    component.saveEdit(0);
    expect(component.editError()).toBeTruthy();
    expect(component.optionsValues).toEqual(['First', 'Second']);
  });

  for (const defaultValue of ['First', ['First', 'Second']]) {
    it(`preserves ${Array.isArray(defaultValue) ? 'multiple' : 'single'} default selections when renaming an option`, () => {
      addOptions();
      component.setDefaultValue(defaultValue);
      component.startEdit(0, 'First');
      component.editControl.setValue(' Renamed ');
      component.saveEdit(0);
      expect(component.optionsValues).toEqual(['Renamed', 'Second']);
      expect(component.getDefaultValues()).toEqual(
        Array.isArray(defaultValue) ? ['Renamed', 'Second'] : 'Renamed',
      );
      expect(component.editingIndex()).toBeNull();
    });
  }

  it('removes a deleted option from the selected defaults', () => {
    addOptions();
    component.setDefaultValue(['First', 'Second']);
    component.removeOption(component.options.at(0), 0);
    expect(component.optionsValues).toEqual(['Second']);
    expect(component.getDefaultValues()).toEqual(['Second']);
  });

  it('cancels edits and resets unsaved option changes', () => {
    addOptions();
    component.startEdit(0, 'First');
    component.editControl.setValue('Changed');
    component.cancelEdit();
    expect(component.optionsValues[0]).toBe('First');
    expect(component.editingIndex()).toBeNull();
    component.onReset();
    expect(component.optionsValues).toEqual([]);
    expect(component.newOption.value).toBeNull();
  });
});
