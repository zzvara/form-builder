import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import type { ComponentFixture} from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';

import { PictureInputComponent } from '@components/picture-input/picture-input.component';

describe('PictureInputComponent', () => {
  let component: PictureInputComponent;
  let fixture: ComponentFixture<PictureInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PictureInputComponent],
      providers: appConfig.providers,
    });
    fixture = TestBed.createComponent(PictureInputComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'PictureInputComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
