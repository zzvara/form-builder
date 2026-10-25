import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardViewComponent } from '@pages/dashboard/card-view/card-view.component';

describe('CardViewComponent', () => {
  let component: CardViewComponent;
  let fixture: ComponentFixture<CardViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardViewComponent],
    });
    fixture = TestBed.createComponent(CardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
