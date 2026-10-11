import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { InputEditComponent } from './input-edit/input-edit.component';
import { appConfig } from '@app/app.config';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { InputComponent } from '@components/input/input.component';
import { FormControl } from '@angular/forms';

describe('TextInputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    const input = getInputGroups(TestBed.inject(TranslateService)).find(
      (item) => item.type === 'InputComponent',
    )!;
    fixture.componentRef.setInput('data', input.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens its settings editor and publishes saved changes', () => {
    const open = spyOn(TestBed.inject(ModalServiceService), 'openModal').and.returnValue(of(true));
    const edited = spyOn(component.edited, 'emit');
    component.edit();
    expect(open).toHaveBeenCalledWith(
      jasmine.objectContaining({ modalContent: InputEditComponent, modalData: component.data }),
    );
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });

  it('formats the configured required and minimum-length error messages', () => {
    Object.assign(component.data, {
      requiredMessage: 'Required',
      minLengthMessage: 'At least {{..}} characters',
      minLengthNumber: 3,
    });
    const control = new FormControl('', { nonNullable: true });
    control.setErrors({ required: true, minlength: true });
    expect(component.getErrorMessages(control)).toEqual(['Required', 'At least 3 characters']);
  });
  
  it('propagates user changes through the input control', async () => {
    const edited = spyOn(component.edited, 'emit');
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.value = 'New answer';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(component.data.defaultValue).toBe('New answer');
    expect(edited).toHaveBeenCalledWith(component.data);
  });
});
