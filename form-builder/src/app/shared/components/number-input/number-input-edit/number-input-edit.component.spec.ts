import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInputEditComponent } from '@components/number-input/number-input-edit/number-input-edit.component';

describe('NumberInputEditComponent', () => {
  let component: NumberInputEditComponent;
  let fixture: ComponentFixture<NumberInputEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberInputEditComponent],
    });
    fixture = TestBed.createComponent(NumberInputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
