import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectEditComponent } from './select-edit.component';

describe('ModalComponent', () => {
  let component: SelectEditComponent;
  let fixture: ComponentFixture<SelectEditComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
