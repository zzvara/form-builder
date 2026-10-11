import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupEditComponent } from '@components/checkbox-group/checkbox-group-edit/checkbox-group-edit.component';

describe('CheckboxGroupEditComponent', () => {
  let component: CheckboxGroupEditComponent;
  let fixture: ComponentFixture<CheckboxGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGroupEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
