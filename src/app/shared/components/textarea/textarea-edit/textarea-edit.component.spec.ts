import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaEditComponent } from '@components/textarea/textarea-edit/textarea-edit.component';

describe('TextareaEditComponent', () => {
  let component: TextareaEditComponent;
  let fixture: ComponentFixture<TextareaEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextareaEditComponent],
    });
    fixture = TestBed.createComponent(TextareaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
