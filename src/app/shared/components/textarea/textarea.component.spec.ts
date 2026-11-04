import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ModalServiceService } from '@services/modal/modal-service.service';
import { TextareaEditComponent } from './textarea-edit/textarea-edit.component';
import { appConfig } from '@app/app.config';
import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';

import { TextareaComponent } from '@components/textarea/textarea.component';

describe('TextareaComponent', () => {
  let component: TextareaComponent;
  let fixture: ComponentFixture<TextareaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextareaComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(TextareaComponent);
    component = fixture.componentInstance;
    const input = getInputGroups(TestBed.inject(TranslateService)).find(
      (item) => item.type === 'TextareaComponent',
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
      jasmine.objectContaining({ modalContent: TextareaEditComponent, modalData: component.data }),
    );
    expect(edited).toHaveBeenCalledOnceWith(component.data);
  });

  it('updates its value and emits edited data when the user types', async () => {
    const edited = spyOn(component.edited, 'emit');
    const input: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    input.value = 'First line\nSecond line';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(component.data.defaultValue).toBe('First line\nSecond line');
    expect(edited).toHaveBeenCalledWith(component.data);
  });
});
