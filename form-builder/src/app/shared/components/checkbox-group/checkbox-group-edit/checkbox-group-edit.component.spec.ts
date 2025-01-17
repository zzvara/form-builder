import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupEditComponent } from '@components/checkbox-group/checkbox-group-edit/checkbox-group-edit.component';

describe('CheckboxGroupEditComponent', () => {
  let component: CheckboxGroupEditComponent;
  let fixture: ComponentFixture<CheckboxGroupEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxGroupEditComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
