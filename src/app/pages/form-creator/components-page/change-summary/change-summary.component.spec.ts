import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { appConfig } from '@app/app.config';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { ChangeSummaryComponent } from './change-summary.component';

describe('ChangeSummaryComponent', () => {
  let component: ChangeSummaryComponent;
  let fixture: ComponentFixture<ChangeSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeSummaryComponent],
      providers: [
        ...appConfig.providers,
        { provide: NZ_MODAL_DATA, useValue: { items: [] } },
        { provide: NzModalRef, useValue: { close: jasmine.createSpy('close') } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
