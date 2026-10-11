import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { InputEditComponent } from '@components/input/input-edit/input-edit.component';

describe('InputEditComponent', () => {
  let component: InputEditComponent;
  let fixture: ComponentFixture<InputEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InputEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(InputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('revalidates dependent minimum and maximum lengths', () => {
    component.getStrictControl('minLength')!.setValue(true);
    component.getStrictControl('minLengthNumber')!.setValue(5);
    component.getStrictControl('maxLength')!.setValue(true);
    component.getStrictControl('maxLengthNumber')!.setValue(3);
    expect(component.getStrictControl('minLengthNumber')!.invalid).toBeTrue();
    expect(component.getStrictControl('maxLengthNumber')!.invalid).toBeTrue();
    component.getStrictControl('maxLengthNumber')!.setValue(8);
    expect(component.getStrictControl('minLengthNumber')!.valid).toBeTrue();
    expect(component.getStrictControl('maxLengthNumber')!.valid).toBeTrue();
  });

  it('saves length restrictions and their error message to the input data', () => {
    component.getStrictControl('questionValue')!.setValue('Name');
    component.getStrictControl('minLength')!.setValue(true);
    component.getStrictControl('minLengthNumber')!.setValue(2);
    component.getStrictControl('minLengthMessage')!.setValue('At least {{..}} characters');
    component.getStrictControl('maxLength')!.setValue(true);
    component.getStrictControl('maxLengthNumber')!.setValue(10);
    component.getStrictControl('showCharacterCounter')!.setValue(true);
    component.saveData();
    expect(TestBed.inject(NZ_MODAL_DATA)).toEqual(
      jasmine.objectContaining({
        questionValue: 'Name',
        minLength: true,
        minLengthNumber: 2,
        maxLength: true,
        maxLengthNumber: 10,
        showCharacterCounter: true,
      }),
    );
    expect(component.errorList()).toContain({
      errorName: 'minlength',
      errorMessage: 'At least 2 characters',
    });
  });
});
