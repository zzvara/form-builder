import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioGroupEditComponent } from '@components/radio-group/radio-group-edit/radio-group-edit.component';

describe('RadioGroupEditComponent', () => {
  let component: RadioGroupEditComponent;
  let fixture: ComponentFixture<RadioGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioGroupEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: { options: [] } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
