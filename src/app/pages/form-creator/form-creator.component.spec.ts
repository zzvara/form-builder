import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreatorComponent } from '@pages/form-creator/form-creator.component';

describe('FormCreatorComponent', () => {
  let component: FormCreatorComponent;
  let fixture: ComponentFixture<FormCreatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCreatorComponent],
    });
    fixture = TestBed.createComponent(FormCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
