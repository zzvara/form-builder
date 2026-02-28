import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatedSectionComponent } from '@components/repeated-section/repeated-section.component';

describe('SectionComponent', () => {
  let component: RepeatedSectionComponent;
  let fixture: ComponentFixture<RepeatedSectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RepeatedSectionComponent],
    });
    fixture = TestBed.createComponent(RepeatedSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
