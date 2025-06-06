import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSummaryComponent } from './change-summary.component';

describe('ChangeSummaryComponent', () => {
  let component: ChangeSummaryComponent;
  let fixture: ComponentFixture<ChangeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
