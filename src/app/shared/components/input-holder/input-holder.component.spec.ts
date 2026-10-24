import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { InputHolderComponent } from '@components/input-holder/input-holder.component';

describe('InputHolderComponent', () => {
  let component: InputHolderComponent;
  let fixture: ComponentFixture<InputHolderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputHolderComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(InputHolderComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'InputComponent',
    )!;
    fixture.componentRef.setInput('formInput', formInput);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears the rendered preview on reset without interacting with the preview', async () => {
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'InputComponent',
    )!;
    Object.assign(formInput.data!, {
      id: 'input',
      sectionId: 'section',
      questionValue: 'Question',
      descriptionValue: 'Description',
      placeholderValue: 'Placeholder',
      defaultValue: 'Default',
    });
    // Mount with populated data, just as when opening an existing project.
    fixture.destroy();
    fixture = TestBed.createComponent(InputHolderComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('formInput', formInput);
    fixture.detectChanges();
    await fixture.whenStable();
    const preview: HTMLInputElement = fixture.nativeElement.querySelector(
      '.input-preview-container input',
    );
    expect(preview.value).toBe('Default');
    expect(preview.placeholder).toBe('Placeholder');
    const changed = spyOn(component.changedEvent, 'emit');

    fixture.debugElement.query(By.css('button[nz-popconfirm]')).triggerEventHandler('nzOnConfirm');
    await fixture.whenStable();

    expect(preview.value).toBe('');
    expect(preview.placeholder).toBe('');
    expect(component.inputData.questionValue).toBeUndefined();
    expect(component.inputData.descriptionValue).toBeUndefined();
    expect(component.inputData.id).toBe('input');
    expect(component.inputData.sectionId).toBe('section');
    expect(changed).toHaveBeenCalledOnceWith(component.inputData);
  });
});
