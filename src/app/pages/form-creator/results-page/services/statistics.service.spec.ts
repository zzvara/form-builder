import { TestBed } from '@angular/core/testing';
import { InstanceOfFormInputDataPipe } from '@app/shared/pipes/instance-of-form-input-data.pipe';
import { inputFixture, projectFixture, sectionFixture } from '@app/testing/fixtures';
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

  it('counts top-level and section inputs by their display title', () => {
    const project = projectFixture({
      editList: [
        { id: 'one', data: inputFixture('one') },
        {
          id: 'section',
          data: sectionFixture('section', [
            inputFixture('two'),
            inputFixture('three', { title: 'Number' }),
          ]),
        },
      ],
    });
    expect(service.calculateSectionInputStats(project)).toEqual({ Text: 2, Number: 1 });
  });

  it('returns empty statistics for absent or empty edit lists', () => {
    expect(service.calculateSectionInputStats(projectFixture())).toEqual({});
    expect(service.calculateSectionInputStats(projectFixture({ editList: undefined }))).toEqual({});
  });
});
