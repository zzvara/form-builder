import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadioGroupEditComponent } from './radio-group-edit.component';

describe('RadioGroupEditComponent', () => {
  let component: RadioGroupEditComponent;
  let fixture: ComponentFixture<RadioGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadioGroupEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RadioGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
