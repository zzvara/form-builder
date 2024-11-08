import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectModalComponent } from './select-modal.component';

describe('ModalComponent', () => {
  let component: SelectModalComponent;
  let fixture: ComponentFixture<SelectModalComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
