import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { NumberInputEditComponent } from './number-input-edit/number-input-edit.component';
import { appConfig } from '@app/app.config';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { NumberInputComponent } from '@components/number-input/number-input.component';

describe('TextInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NumberInputComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    const input = getInputGroups(TestBed.inject(TranslateService)).find(
      (item) => item.type === 'NumberInputComponent',
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
      jasmine.objectContaining({
        modalContent: NumberInputEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });

  it('honors zero bounds and falls back to unbounded values when disabled', () => {
    Object.assign(component.data, { min: true, minNumber: 0, max: true, maxNumber: 0 });
    expect(component.minNumber).toBe(0);
    expect(component.maxNumber).toBe(0);
    component.data.min = false;
    component.data.max = false;
    expect(component.minNumber).toBe(-Infinity);
    expect(component.maxNumber).toBe(Infinity);
  });

  it('round-trips values through a configured prefix and suffix', () => {
    component.data.format = true;
    component.data.formatter = '$ {{..}} USD';
    expect(component.inputFormatter(12.5)).toBe('$ 12.5 USD');
    expect(component.inputParser('$ 12.5 USD')).toBe(12.5);
    component.data.format = false;
    expect(component.inputFormatter(-2)).toBe('-2');
    expect(component.inputParser('-2')).toBe(-2);
    component.data.format = true;
    component.data.formatter = 'USD';
    expect(component.inputParser('12')).toBe(12);
  });
});
