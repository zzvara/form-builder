import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupComponent } from '@components/checkbox-group/checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckboxGroupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
