import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture} from '@angular/core/testing';
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
});
