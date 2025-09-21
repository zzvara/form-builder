import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberInputComponent } from '@components/number-input/number-input.component';

xdescribe('TextInputComponent', () => {
  let component: NumberInputComponent;
  let fixture: ComponentFixture<NumberInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberInputComponent],
    });
    fixture = TestBed.createComponent(NumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
