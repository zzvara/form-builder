import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectEditComponent } from '@components/select/select-edit/select-edit.component';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { appConfig } from '@app/app.config';

describe('ModalComponent', () => {
  let component: SelectEditComponent;
  let fixture: ComponentFixture<SelectEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectEditComponent],
      providers: [
        ...appConfig.providers,
        {
          provide: NZ_MODAL_DATA,
          useValue: { selectOptions: [], isMultipleChoice: false },
        },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
