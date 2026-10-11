import { TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ModalServiceService } from '@services/modal/modal-service.service';
import type { InputData } from '@interfaces/input-data';
import type { AbstractEditForm } from './abstract-edit-form';
import { AbstractInput } from './abstract-input';

class InputHarness extends AbstractInput<
  string,
  InputData<string>,
  AbstractEditForm<string, InputData<string>>
> {
  edit() {
    /* Concrete editors open their own modal. */
  }
}

describe('AbstractInput', () => {
  let component: InputHarness;
  let markForCheck: jasmine.Spy;

  beforeEach(() => {
    markForCheck = jasmine.createSpy('markForCheck');
    TestBed.configureTestingModule({
      providers: [
        { provide: ModalServiceService, useValue: {} },
        { provide: TranslateService, useValue: {} },
        { provide: ChangeDetectorRef, useValue: { markForCheck } },
      ],
    });
    component = TestBed.runInInjectionContext(() => new InputHarness());
    component.data = { defaultValue: 'initial' };
    component.ngOnInit();
  });

  it('emits changes once per distinct value and requests change detection', () => {
    const emitted = spyOn(component.edited, 'emit');
    component.onChange(new Event('change'));
    expect(emitted).not.toHaveBeenCalled();
    component.data.defaultValue = 'new';
    component.onChange(new Event('change'));
    component.onChange(new Event('change'));
    expect(emitted).toHaveBeenCalledOnceWith(component.data);
    expect(markForCheck).toHaveBeenCalledTimes(1);
  });
  
  it('emits modal edits only after a successful save', () => {
    const emitted = spyOn(component.edited, 'emit');
    component.defaultOnEditSubscribeEvent(undefined);
    component.defaultOnEditSubscribeEvent(false);
    expect(emitted).not.toHaveBeenCalled();
    component.defaultOnEditSubscribeEvent(true);
    expect(emitted).toHaveBeenCalledOnceWith(component.data);
  });
});
