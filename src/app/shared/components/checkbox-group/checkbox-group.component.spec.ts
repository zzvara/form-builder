import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { CheckboxGroupEditComponent } from './checkbox-group-edit/checkbox-group-edit.component';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { CheckboxGroupComponent } from '@components/checkbox-group/checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGroupComponent],
      providers: appConfig.providers,
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'CheckboxGroupComponent',
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
        modalContent: CheckboxGroupEditComponent,
        modalData: component.data,
      }),
    );
    expect(edited).not.toHaveBeenCalled();
    open.and.returnValue(of(true));
    component.edit();
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });
});
