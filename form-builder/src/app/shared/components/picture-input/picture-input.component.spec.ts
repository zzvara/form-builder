import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureInputComponent } from '@components/picture-input/picture-input.component';

describe('PictureInputComponent', () => {
  let component: PictureInputComponent;
  let fixture: ComponentFixture<PictureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PictureInputComponent],
    });
    fixture = TestBed.createComponent(PictureInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
