import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import { ApplicationRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import type { AbstractControl } from '@angular/forms';
import type { CdkDragDrop } from '@angular/cdk/drag-drop';
import { RadioGroupComponent } from '../radio-group.component';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { firstValueFrom } from 'rxjs';

import { RadioGroupEditComponent } from '@components/radio-group/radio-group-edit/radio-group-edit.component';

describe('RadioGroupEditComponent', () => {
  let component: RadioGroupEditComponent;
  let fixture: ComponentFixture<RadioGroupEditComponent>;

  function labels(): string[] {
    return Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.option-label')).map(
      (label) => label.textContent!.trim(),
    );
  }

  async function enterText(selector: string, text: string) {
    const input: HTMLInputElement = fixture.nativeElement.querySelector(selector);
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
  }

  async function click(selector: string) {
    const button: HTMLElement = fixture.nativeElement.querySelector(selector);
    button.click();
    await fixture.whenStable();
  }

  async function clickDefault(index: number) {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr.cdk-drag');
    rows[index].querySelector('input[type="checkbox"]').click();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        {
          provide: NZ_MODAL_DATA,
          useValue: {
            questionValue: 'Choose an option',
            required: false,
            isButton: false,
            options: [
              { option_id: 1, option_description: 'First option' },
              { option_id: 2, option_description: 'Second option' },
              { option_id: 3, option_description: 'Third option' },
            ],
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders all option labels when opened, without an extra click', async () => {
    await fixture.whenStable();
    expect(labels()).toEqual(['First option', 'Second option', 'Third option']);
    expect(
      fixture.nativeElement.querySelector('input[formControlName="questionValue"]').value,
    ).toBe('Choose an option');
    expect(component.isInvalid).toBeFalse();
  });

  it('adds a complete option row and saves its description', async () => {
    await fixture.whenStable();
    await enterText('nz-input-group input', 'Fourth option');
    await click('nz-input-group button');

    expect(labels()).toEqual(['First option', 'Second option', 'Third option', 'Fourth option']);
    const row: HTMLElement = fixture.nativeElement.querySelector('tbody tr:last-child');
    expect(row.querySelectorAll('button').length).toBe(2);
    expect(row.querySelector('input[type="checkbox"]')).not.toBeNull();
    expect(component.isInvalid).toBeFalse();
    expect(component.onSave()).toBeTrue();
    expect(component.nzModalData.options[3]).toEqual({
      option_id: 4,
      option_description: 'Fourth option',
    });
  });

  it('persists renamed option labels and displays them in the radio group preview', async () => {
    await fixture.whenStable();
    await click('tbody tr.cdk-drag .view-container button');
    expect(component.editControl.value).toBe('First option');
    await enterText('.edit-input', 'Renamed option');
    await click('.edit-container button');

    expect(labels()[0]).toBe('Renamed option');
    expect(component.onSave()).toBeTrue();
    const preview = TestBed.createComponent(RadioGroupComponent);
    preview.componentRef.setInput('data', component.nzModalData);
    await preview.whenStable();
    expect(preview.nativeElement.textContent).toContain('Renamed option');
    expect(preview.nativeElement.textContent).toContain('Second option');
    preview.destroy();
  });

  it('rejects blank and duplicate options and duplicate renames', () => {
    for (const value of ['   ', 'First option']) {
      component.newOptionValue = value;
      component.addOption();
      expect(component.options.length).toBe(3);
    }
    component.startEdit(0, 'First option');
    component.editControl.setValue('Second option');
    component.saveEdit(0);
    expect(component.editError()).toBeTruthy();
    expect(component.optionDescriptions[0]).toBe('First option');
  });

  it('revalidates a pending new option when an existing option is renamed', () => {
    component.newOptionValue = 'First option';
    expect(component.newOption.invalid).toBeTrue();
    component.startEdit(0, 'First option');
    component.editControl.setValue('Renamed option');
    component.saveEdit(0);
    expect(component.newOption.valid).toBeTrue();
  });

  it('allows only one default option and allows clearing it', async () => {
    await fixture.whenStable();
    await clickDefault(0);
    expect(component.getControlValue('defaultValue')).toBe(1);
    await clickDefault(1);
    expect(component.getControlValue('defaultValue')).toBe(2);
    expect(fixture.nativeElement.querySelectorAll('tbody input:checked').length).toBe(1);
    expect(component.onSave()).toBeTrue();
    expect(component.nzModalData.defaultValue).toBe(2);

    await clickDefault(1);
    expect(fixture.nativeElement.querySelectorAll('tbody input:checked').length).toBe(0);
    component.saveData();
    expect(component.nzModalData.defaultValue).toBeUndefined();
  });

  it('requires a message but not a default answer when the question is required', async () => {
    await fixture.whenStable();
    await click('[formControlName="required"] input');
    expect(component.isInvalid).toBeTrue();
    await enterText('input[formControlName="requiredMessage"]', 'Please choose an option');

    expect(component.isInvalid).toBeFalse();
    expect(component.onSave()).toBeTrue();
    expect(component.nzModalData.required).toBeTrue();
    expect(component.nzModalData.requiredMessage).toBe('Please choose an option');
    expect(component.nzModalData.defaultValue).toBeUndefined();
  });

  it('updates the real modal Save button and saves a required question without a default', async () => {
    const app = TestBed.inject(ApplicationRef);
    const data = structuredClone(component.nzModalData);
    const result = firstValueFrom(
      TestBed.inject(ModalServiceService).openModal({
        modalTitle: 'Radio group settings',
        modalContent: RadioGroupEditComponent,
        modalData: data,
      }),
    );
    try {
      await app.whenStable();
      const dialog = document.querySelector('.ant-modal')!;
      expect(dialog.querySelectorAll('.option-label').length).toBe(3);
      const save = dialog.querySelector<HTMLButtonElement>('.ant-modal-footer .ant-btn-primary')!;
      expect(save.disabled).toBeFalse();

      dialog.querySelector<HTMLInputElement>('[formControlName="required"] input')!.click();
      await app.whenStable();
      expect(save.disabled).toBeTrue();

      const message = dialog.querySelector<HTMLInputElement>(
        'input[formControlName="requiredMessage"]',
      )!;
      message.value = 'Please choose an option';
      message.dispatchEvent(new Event('input', { bubbles: true }));
      await app.whenStable();
      expect(save.disabled).toBeFalse();
      save.click();
      expect(await result).toBeTrue();
      expect(data.required).toBeTrue();
      expect(data.requiredMessage).toBe('Please choose an option');
      expect(data.defaultValue).toBeUndefined();
    } finally {
      TestBed.inject(NzModalService).closeAll();
      await app.whenStable();
    }
  });

  it('requires at least two options and preserves defaults when deleting other options', () => {
    component.selectDefaultOption(1, true);
    component.removeOption(2);
    expect(component.isInvalid).toBeFalse();
    expect(component.getControlValue('defaultValue')).toBe(1);
    component.removeOption(0);
    expect(component.getControlValue('defaultValue')).toBeUndefined();
    expect(component.isInvalid).toBeTrue();
    expect(component.getMinOptions()).toBe(1);
  });

  it('saves reordered options even when no other setting changes', () => {
    component.drop({ previousIndex: 0, currentIndex: 2 } as CdkDragDrop<AbstractControl[]>);
    expect(component.onSave()).toBeTrue();
    expect(component.nzModalData.options.map((option) => option.option_id)).toEqual([2, 3, 1]);
  });

  it('resets edited options, validation, and the active rename editor', async () => {
    await fixture.whenStable();
    const initial = structuredClone(component.nzModalData);
    component.newOptionValue = 'Fourth option';
    component.addOption();
    component.selectDefaultOption(2, true);
    component.getControl('required')!.setValue(true);
    component.startEdit(0, 'First option');
    component.onReset();
    await fixture.whenStable();

    expect(labels()).toEqual(initial.options.map((option) => option.option_description));
    expect(component.editingIndex()).toBeNull();
    expect(component.getControlValue('defaultValue')).toBeNull();
    expect(component.isInvalid).toBeFalse();
    expect(component.isPristine).toBeTrue();
    expect(component.nzModalData).toEqual(initial);
  });
});
