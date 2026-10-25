import { TestBed } from '@angular/core/testing';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';

import { StatisticsService } from '@pages/form-creator/results-page/services/statistics.service';

describe('StatisticsService', () => {
  let service: StatisticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [InstanceOfFormInputDataPipe] });
    service = TestBed.inject(StatisticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
