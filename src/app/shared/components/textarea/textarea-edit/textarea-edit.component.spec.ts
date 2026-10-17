import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';
import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { TextareaEditComponent } from '@components/textarea/textarea-edit/textarea-edit.component';

describe('TextareaEditComponent', () => {
  let component: TextareaEditComponent;
  let fixture: ComponentFixture<TextareaEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TextareaEditComponent],
      providers: [
        ...appConfig.providers,
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: NZ_MODAL_DATA, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(TextareaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
