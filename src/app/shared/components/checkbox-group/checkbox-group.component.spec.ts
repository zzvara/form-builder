import { getInputGroups } from '@pages/edit/config/edit-data-config';
import { TranslateService } from '@ngx-translate/core';
import { appConfig } from '@app/app.config';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupComponent } from '@components/checkbox-group/checkbox-group.component';

describe('CheckboxGroupComponent', () => {
  let component: CheckboxGroupComponent;
  let fixture: ComponentFixture<CheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGroupComponent],
      providers: appConfig.providers,
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupComponent);
    component = fixture.componentInstance;
    const formInput = getInputGroups(TestBed.inject(TranslateService)).find(
      (input) => input.type === 'CheckboxGroupComponent',
    )!;
    fixture.componentRef.setInput('data', formInput.data);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
