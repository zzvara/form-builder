import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { RadioGroupEditComponent } from './radio-group-edit/radio-group-edit.component';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { RadioGroupComponent } from '@components/radio-group/radio-group.component';

describe('RadioGroupComponent', () => {
  let component: RadioGroupComponent;
  let fixture: ComponentFixture<RadioGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupComponent],
      providers: appConfig.providers,
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'RadioGroupComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens its editor and publishes changes only when saved', () => {
    const open = spyOn(TestBed.inject(ModalServiceService), 'openModal').and.returnValue(
      of(undefined),
    );
    const edited = spyOn(component.edited, 'emit');
    component.edit();
    expect(open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        modalContent: RadioGroupEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).not.toHaveBeenCalled();
    open.and.returnValue(of(true));
    component.edit();
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });
});
