import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { NumberInputEditComponent } from '@components/number-input/number-input-edit/number-input-edit.component';

describe('NumberInputEditComponent', () => {
  let component: NumberInputEditComponent;
  let fixture: ComponentFixture<NumberInputEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NumberInputEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(NumberInputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  for (const enabled of [true, false]) {
    it(`saves ${enabled ? 'enabled' : 'disabled'} numeric bounds and formatting`, () => {
      const settings = {
        questionValue: 'Amount',
        min: enabled,
        max: enabled,
        minNumber: 0,
        maxNumber: 100,
        stepNumber: 5,
        format: enabled,
        formatter: '{{..}} USD',
        setDefaultValue: enabled,
        defaultValue: 10,
      };
      for (const [name, value] of Object.entries(settings))
        component.getControl(name)!.setValue(value);
      component.saveData();
      expect(TestBed.inject(NZ_MODAL_DATA)).toEqual(
        jasmine.objectContaining({
          questionValue: 'Amount',
          min: enabled,
          max: enabled,
          format: enabled,
          stepNumber: 5,
          defaultValue: enabled ? 10 : undefined,
        }),
      );
      if (enabled)
        expect(TestBed.inject(NZ_MODAL_DATA)).toEqual(
          jasmine.objectContaining({ minNumber: 0, maxNumber: 100, formatter: '{{..}} USD' }),
        );
    });
  }

  it('parses plain numbers when formatting is disabled or lacks a placeholder', () => {
    expect(component.inputFormatter(12)).toBe('12');
    expect(component.inputParser('12')).toBe(12);
    component.getControl('format')!.setValue(true);
    component.getControl('formatter')!.setValue('USD');
    expect(component.inputParser('12')).toBe(12);
  });

  it('treats zero as an enabled numeric bound', () => {
    component.getStrictControl('min')!.setValue(true);
    component.getStrictControl('minNumber')!.setValue(0);
    component.getStrictControl('max')!.setValue(true);
    component.getStrictControl('maxNumber')!.setValue(0);
    expect(component.minNumOrNegInf).toBe(0);
    expect(component.maxNumOrInf).toBe(0);
    component.getStrictControl('min')!.setValue(false);
    component.getStrictControl('max')!.setValue(false);
    expect(component.minNumOrNegInf).toBe(-Infinity);
    expect(component.maxNumOrInf).toBe(Infinity);
  });

  it('round-trips a number formatted with a prefix and suffix', () => {
    component.getStrictControl('format')!.setValue(true);
    component.getStrictControl('formatter')!.setValue('$ {{..}} USD');
    expect(component.inputFormatter(12.5)).toBe('$ 12.5 USD');
    expect(component.inputParser('$ 12.5 USD')).toBe(12.5);
  });

  it('requires the value placeholder when custom formatting is enabled', () => {
    component.getStrictControl('format')!.setValue(true);
    component.getStrictControl('formatter')!.setValue('USD');
    expect(component.getStrictControl('formatter')!.invalid).toBeTrue();
    component.getStrictControl('formatter')!.setValue('{{..}} USD');
    expect(component.getStrictControl('formatter')!.valid).toBeTrue();
  });
});
