import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureInputEditComponent } from './picture-input-edit.component';

describe('PictureInputEditComponent', () => {
  let component: PictureInputEditComponent;
  let fixture: ComponentFixture<PictureInputEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PictureInputEditComponent],
    });
    fixture = TestBed.createComponent(PictureInputEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
