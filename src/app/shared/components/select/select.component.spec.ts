import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { SelectEditComponent } from './select-edit/select-edit.component';
import { appConfig } from '@app/app.config';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';

import { SelectComponent } from '@components/select/select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    const input = getInputGroups(TestBed.inject(TranslateService)).find(
      (item) => item.type === 'SelectComponent',
    )!;
    fixture.componentRef.setInput('data', input.data);
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
      jasmine.objectContaining({ modalContent: SelectEditComponent, modalData: component.data }),
    );
    expect(edited).not.toHaveBeenCalled();
    open.and.returnValue(of(true));
    component.edit();
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });
});
